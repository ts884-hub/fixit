import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-server';

// ─── GET /api/properties ──────────────────────────────────────────────────────
// Protected. Returns all properties belonging to the authenticated manager.

export async function GET(request: NextRequest) {
  let user;
  try {
    user = await requireAuth(request);
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('manager_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[GET /api/properties]', error);
    return NextResponse.json({ error: 'Failed to fetch properties.' }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// ─── POST /api/properties ─────────────────────────────────────────────────────
// Protected. Creates a new property for the authenticated manager.
// Body: { name: string, address: string }
// Returns the created property including its unique submission token.

export async function POST(request: NextRequest) {
  let user;
  try {
    user = await requireAuth(request);
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { name, address } = body as Record<string, unknown>;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required.' }, { status: 400 });
  }
  if (!address || typeof address !== 'string' || !address.trim()) {
    return NextResponse.json({ error: 'address is required.' }, { status: 400 });
  }

  // Generate a URL-safe 32-character hex token (128-bit entropy).
  const token = crypto.randomUUID().replace(/-/g, '');

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('properties')
    .insert({
      name: name.trim(),
      address: address.trim(),
      token,
      manager_id: user.id,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('[POST /api/properties]', error);
    return NextResponse.json({ error: 'Failed to create property.' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
