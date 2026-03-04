import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-server';

function normalisePhone(raw: string): string {
  return raw.replace(/[\s\-\(\)]/g, '');
}

// ─── GET /api/profile ─────────────────────────────────────────────────────────
// Returns the authenticated manager's profile, or 404 if none exists.

export async function GET(request: NextRequest) {
  let user;
  try {
    user = await requireAuth(request);
  } catch (err) {
    return err as NextResponse;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('manager_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
  }

  return NextResponse.json(data);
}

// ─── PUT /api/profile ─────────────────────────────────────────────────────────
// Creates or updates the authenticated manager's profile.

export async function PUT(request: NextRequest) {
  let user;
  try {
    user = await requireAuth(request);
  } catch (err) {
    return err as NextResponse;
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { phone, email } = body as { phone?: string; email?: string };

  if (!phone?.trim()) {
    return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
  }
  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('manager_profiles')
    .upsert(
      {
        id: user.id,
        phone: normalisePhone(phone),
        email: email.trim().toLowerCase(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error || !data) {
    console.error('[PUT /api/profile]', error);
    return NextResponse.json({ error: 'Failed to save profile.' }, { status: 500 });
  }

  return NextResponse.json(data);
}
