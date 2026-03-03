import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-server';
import { resolvePhotoUrl } from '@/lib/storage';

const VALID_STATUSES = ['new', 'in_progress', 'done'] as const;

// ─── GET /api/tickets/:id ─────────────────────────────────────────────────────
// Protected. Returns a single ticket by ID.
// photo_url is resolved to a fresh signed URL (1 hr) from the private bucket.

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Ticket ID is required.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single();

  if (error?.code === 'PGRST116' || !data) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  if (error) {
    console.error('[GET /api/tickets/:id]', error);
    return NextResponse.json({ error: 'Failed to fetch ticket.' }, { status: 500 });
  }

  // Resolve stored file path → signed URL before sending to client
  const ticket = {
    ...data,
    photo_url: await resolvePhotoUrl(supabase, data.photo_url),
  };

  return NextResponse.json(ticket);
}

// ─── PATCH /api/tickets/:id ───────────────────────────────────────────────────
// Protected. Accepts { status?, manager_notes? } and returns the updated Ticket.

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Ticket ID is required.' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const patch = body as Record<string, unknown>;
  const update: Record<string, unknown> = {};

  if ('status' in patch) {
    if (
      typeof patch.status !== 'string' ||
      !VALID_STATUSES.includes(patch.status as typeof VALID_STATUSES[number])
    ) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(', ')}.` },
        { status: 400 }
      );
    }
    update.status = patch.status;
  }

  if ('manager_notes' in patch) {
    if (patch.manager_notes !== null && typeof patch.manager_notes !== 'string') {
      return NextResponse.json(
        { error: 'manager_notes must be a string or null.' },
        { status: 400 }
      );
    }
    update.manager_notes = patch.manager_notes;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update. Provide status and/or manager_notes.' },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Verify ticket exists first
  const { data: existing } = await supabase
    .from('tickets')
    .select('id')
    .eq('id', id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('tickets')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    console.error('[PATCH /api/tickets/:id]', error);
    return NextResponse.json({ error: 'Failed to update ticket.' }, { status: 500 });
  }

  // Resolve stored file path → signed URL before sending to client
  const ticket = {
    ...data,
    photo_url: await resolvePhotoUrl(supabase, data.photo_url),
  };

  return NextResponse.json(ticket);
}
