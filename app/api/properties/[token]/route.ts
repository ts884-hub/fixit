import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// ─── GET /api/properties/:token ───────────────────────────────────────────────
// PUBLIC — no auth required.
// Called by the tenant intake form at /request/:token to display the
// property name and address. Returns only public-safe fields (no manager_id).

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('properties')
    .select('id, name, address, token')
    .eq('token', token)
    .single();

  if (error?.code === 'PGRST116' || !data) {
    return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
  }

  if (error) {
    console.error('[GET /api/properties/:token]', error);
    return NextResponse.json({ error: 'Failed to fetch property.' }, { status: 500 });
  }

  // Return only public-safe fields — manager_id is intentionally omitted.
  return NextResponse.json({
    id: data.id,
    name: data.name,
    address: data.address,
    token: data.token,
  });
}
