import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-server';
import { BUCKET, resolvePhotoUrls } from '@/lib/storage';

const VALID_URGENCIES = ['low', 'medium', 'high'] as const;
const VALID_STATUSES = ['new', 'in_progress', 'done'] as const;

// ─── GET /api/tickets ─────────────────────────────────────────────────────────
// Protected. Returns tickets that belong to the authenticated manager,
// sorted newest-first.
// Query params: status=all|new|in_progress|done  q=<search term>
// photo_url in each ticket is a fresh signed URL (1 hr) for the private bucket.

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
    // Only return tickets that belong to this manager
    .eq('manager_id', user.id)
    .order('created_at', { ascending: false });

  // Filter by status (ignore 'all' or missing)
  if (status && status !== 'all' && VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    query = query.eq('status', status);
  }

  // Full-text search across property, unit, tenant_name
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

  // Resolve file paths → signed URLs (single batch round-trip)
  const tickets = await resolvePhotoUrls(supabase, data ?? []);

  return NextResponse.json(tickets);
}

// ─── POST /api/tickets ────────────────────────────────────────────────────────
// Public (no auth). Accepts JSON or multipart/form-data.
// Stores the file PATH (not a public URL) in photo_url — bucket is private.
//
// Optional field: property_token
//   When present the server looks up the matching property row and
//   automatically sets manager_id + property_id on the new ticket,
//   and overrides the property field with the canonical property address.
//   This keeps tenant routing invisible to the submitter.

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
    // JSON body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    fields = body as Record<string, string>;
  }

  // ── Resolve property_token (optional) ──────────────────────────────────────
  // If a token is present, look up the property and derive manager_id,
  // property_id, and the canonical property address.
  let managerId: string | null = null;
  let propertyId: string | null = null;

  if (fields.property_token) {
    const supabase = createAdminClient();
    const { data: prop, error: propError } = await supabase
      .from('properties')
      .select('id, address, manager_id')
      .eq('token', fields.property_token)
      .single();

    if (propError || !prop) {
      return NextResponse.json(
        { error: 'Invalid property_token. The submission link may have expired or be incorrect.' },
        { status: 400 }
      );
    }

    // Override the property field with the DB-authoritative address
    fields.property = prop.address;
    managerId = prop.manager_id;
    propertyId = prop.id;
  }

  // ── Validate required fields ────────────────────────────────────────────────
  const required = [
    'property',
    'unit',
    'tenant_name',
    'tenant_phone',
    'category',
    'description',
    'urgency',
  ] as const;

  for (const field of required) {
    if (!fields[field] || typeof fields[field] !== 'string' || !fields[field].trim()) {
      return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
    }
  }

  if (!VALID_URGENCIES.includes(fields.urgency as typeof VALID_URGENCIES[number])) {
    return NextResponse.json(
      { error: `urgency must be one of: ${VALID_URGENCIES.join(', ')}.` },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // photo_url stores the STORAGE FILE PATH (e.g. "photos/uuid.jpg").
  // Signed URLs are generated on read — never stored in the DB.
  let photoPath: string | null = null;

  if (photoFile && photoFile.size > 0) {
    const ext = photoFile.name.split('.').pop() ?? 'jpg';
    const filePath = `photos/${crypto.randomUUID()}.${ext}`;

    const arrayBuffer = await photoFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: photoFile.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      console.error('[POST /api/tickets] photo upload failed:', uploadError);
      // Non-fatal — ticket is created without a photo
    } else {
      photoPath = filePath;
    }
  }

  const { data, error } = await supabase
    .from('tickets')
    .insert({
      property: fields.property.trim(),
      unit: fields.unit.trim(),
      tenant_name: fields.tenant_name.trim(),
      tenant_phone: fields.tenant_phone.trim(),
      category: fields.category.trim(),
      description: fields.description.trim(),
      urgency: fields.urgency,
      photo_url: photoPath, // stored as a path, resolved to signed URL on read
      // Set when submitted via a property token; null for anonymous submissions
      manager_id: managerId,
      property_id: propertyId,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('[POST /api/tickets]', error);
    return NextResponse.json({ error: 'Failed to create ticket.' }, { status: 500 });
  }

  // Resolve the path to a signed URL before returning to the client
  const [ticket] = await resolvePhotoUrls(supabase, [data]);
  return NextResponse.json(ticket, { status: 201 });
}
