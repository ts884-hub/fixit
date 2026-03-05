import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-server';
import { BUCKET, resolvePhotoUrls } from '@/lib/storage';
import { sendSms } from '@/lib/notify/sms';
import { sendManagerEmail } from '@/lib/notify/email';
import {
  formatSmsMessage,
  buildNewTicketEmail,
  type NotifyTicketData,
} from '@/lib/notify/templates';

const VALID_URGENCIES   = ['low', 'medium', 'high'] as const;
const VALID_STATUSES    = ['new', 'in_progress', 'done'] as const;
const VALID_LOCATIONS   = [
  'kitchen', 'bathroom', 'living_room', 'bedroom',
  'hallway', 'laundry', 'exterior', 'common_area', 'other',
] as const;

// ─── GET /api/tickets ─────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  let user;
  try {
    user = await requireAuth(request);
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const q = searchParams.get('q')?.trim();

  const supabase = createAdminClient();
  let query = supabase
    .from('tickets')
    .select('*')
    .eq('manager_id', user.id)
    .order('created_at', { ascending: false });

  if (status && status !== 'all' && VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    query = query.eq('status', status);
  }

  if (q) {
    query = query.or(
      `property.ilike.%${q}%,unit.ilike.%${q}%,tenant_name.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error('[GET /api/tickets]', error);
    return NextResponse.json({ error: 'Failed to fetch tickets.' }, { status: 500 });
  }

  const tickets = await resolvePhotoUrls(supabase, data ?? []);
  return NextResponse.json(tickets);
}

// ─── POST /api/tickets ────────────────────────────────────────────────────────
// Public (no auth). Accepts JSON or multipart/form-data.
// Fires SMS + email notification after ticket insert.

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';
  let fields: Record<string, string> = {};
  let photoFile: File | null = null;

  if (contentType.includes('multipart/form-data')) {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: 'Failed to parse form data.' }, { status: 400 });
    }
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (key === 'photo') photoFile = value;
      } else {
        fields[key] = value;
      }
    }
  } else {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    fields = body as Record<string, string>;
  }

  // ── Resolve property_token ─────────────────────────────────────────────────
  let managerId: string | null = null;
  let propertyId: string | null = null;
  let propertyName: string = '';

  const supabase = createAdminClient();

  if (fields.property_token) {
    const { data: prop, error: propError } = await supabase
      .from('properties')
      .select('id, name, address, manager_id')
      .eq('token', fields.property_token)
      .single();

    if (propError || !prop) {
      return NextResponse.json(
        { error: 'Invalid property link. Please contact your property manager.' },
        { status: 400 }
      );
    }

    fields.property = prop.address;
    managerId = prop.manager_id;
    propertyId = prop.id;
    propertyName = prop.name;
  }

  // ── Validate required fields ───────────────────────────────────────────────
  const required = [
    'property', 'unit', 'tenant_name', 'tenant_phone',
    'category', 'description', 'urgency', 'location_area',
  ] as const;

  for (const field of required) {
    if (!fields[field]?.trim()) {
      return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
    }
  }

  if (!VALID_URGENCIES.includes(fields.urgency as typeof VALID_URGENCIES[number])) {
    return NextResponse.json(
      { error: `urgency must be one of: ${VALID_URGENCIES.join(', ')}.` },
      { status: 400 }
    );
  }

  if (!VALID_LOCATIONS.includes(fields.location_area as typeof VALID_LOCATIONS[number])) {
    return NextResponse.json(
      { error: `location_area must be one of: ${VALID_LOCATIONS.join(', ')}.` },
      { status: 400 }
    );
  }

  // ── Photo upload (non-fatal) ───────────────────────────────────────────────
  let photoPath: string | null = null;

  if (photoFile && photoFile.size > 0) {
    const ext = photoFile.name.split('.').pop() ?? 'jpg';
    const filePath = `photos/${crypto.randomUUID()}.${ext}`;
    const buffer = new Uint8Array(await photoFile.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: photoFile.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      console.error('[POST /api/tickets] photo upload failed:', uploadError);
    } else {
      photoPath = filePath;
    }
  }

  // ── Insert ticket ──────────────────────────────────────────────────────────
  const { data, error } = await supabase
    .from('tickets')
    .insert({
      property:       fields.property.trim(),
      unit:           fields.unit.trim(),
      tenant_name:    fields.tenant_name.trim(),
      tenant_phone:   fields.tenant_phone.trim(),
      category:       fields.category.trim(),
      description:    fields.description.trim(),
      urgency:        fields.urgency,
      location_area:  fields.location_area,
      location_notes: fields.location_notes?.trim() || null,
      photo_url:      photoPath,
      manager_id:     managerId,
      property_id:    propertyId,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('[POST /api/tickets]', error);
    return NextResponse.json({ error: 'Failed to create ticket.' }, { status: 500 });
  }

  // ── Resolve photo path → signed URL for notifications ─────────────────────
  const [ticket] = await resolvePhotoUrls(supabase, [data]);

  // ── Send notifications (awaited so Vercel doesn't kill the function early) ──
  if (managerId) {
    try {
      await sendNotifications({ supabase, managerId, ticket, propertyName });
    } catch (err) {
      // Notification failure never blocks the tenant's success response
      console.error('[POST /api/tickets] Notification error:', err);
    }
  }

  return NextResponse.json(ticket, { status: 201 });
}

// ─── Notification helper ───────────────────────────────────────────────────────

async function sendNotifications({
  supabase,
  managerId,
  ticket,
  propertyName,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  managerId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ticket: any;
  propertyName: string;
}) {
  const appBaseUrl = process.env.APP_BASE_URL ?? '';

  // Fetch manager auth user (for email)
  const { data: authData } = await supabase.auth.admin.getUserById(managerId);
  const managerEmail = authData?.user?.email;

  // Fetch manager profile (for phone)
  const { data: profile } = await supabase
    .from('manager_profiles')
    .select('phone, email')
    .eq('id', managerId)
    .single();

  const managerPhone = profile?.phone;
  const notifyEmail  = managerEmail ?? profile?.email;

  const notifyData: NotifyTicketData = {
    id:             ticket.id,
    property_name:  propertyName || ticket.property,
    property:       ticket.property,
    unit:           ticket.unit,
    location_area:  ticket.location_area,
    location_notes: ticket.location_notes,
    category:       ticket.category,
    urgency:        ticket.urgency,
    description:    ticket.description,
    photo_url:      ticket.photo_url ?? null,
    tenant_name:    ticket.tenant_name,
    tenant_phone:   ticket.tenant_phone,
  };

  const dashboardUrl = `${appBaseUrl}/dashboard/${notifyData.id}`;
  const email = notifyEmail
    ? buildNewTicketEmail(notifyData, dashboardUrl)
    : null;

  const results = await Promise.allSettled([
    managerPhone
      ? sendSms(managerPhone, formatSmsMessage(notifyData, appBaseUrl))
      : Promise.resolve(),
    email && notifyEmail
      ? sendManagerEmail({ to: notifyEmail, ...email })
      : Promise.resolve(),
  ]);

  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[Notification] ${i === 0 ? 'SMS' : 'Email'} failed:`, r.reason);
    }
  });
}
