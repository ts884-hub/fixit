import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

function normalisePhone(raw: string): string {
  // Strip spaces, dashes, parentheses; keep leading +
  return raw.replace(/[\s\-\(\)]/g, '');
}

// ─── POST /api/auth/signup ─────────────────────────────────────────────────
// Public — creates a new manager account and returns an access token.

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { email, password, phone } = body as {
    email?: string;
    password?: string;
    phone?: string;
  };

  if (!email?.trim() || !password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 }
    );
  }
  if (!phone?.trim()) {
    return NextResponse.json(
      { error: 'Phone number is required.' },
      { status: 400 }
    );
  }

  const normalisedPhone = normalisePhone(phone);
  const normalisedEmail = email.trim().toLowerCase();

  const supabase = createAdminClient();

  // 1. Create auth user
  const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
    email: normalisedEmail,
    password,
    email_confirm: true,
  });

  if (createError) {
    const msg = createError.message.toLowerCase().includes('already registered')
      ? 'An account with this email already exists.'
      : createError.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // 2. Sign in to get session token
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: normalisedEmail,
    password,
  });

  if (signInError || !signInData.session) {
    return NextResponse.json(
      { error: 'Account created. Please sign in.', loginRedirect: true },
      { status: 200 }
    );
  }

  const userId = createdUser.user?.id ?? signInData.user?.id;

  // 3. Create manager_profiles row (best-effort — don't fail signup if this errors)
  if (userId) {
    const { error: profileError } = await supabase
      .from('manager_profiles')
      .insert({ id: userId, phone: normalisedPhone, email: normalisedEmail });

    if (profileError) {
      console.error('[signup] Failed to create manager_profiles row:', profileError);
    }
  }

  return NextResponse.json(
    { token: signInData.session.access_token },
    { status: 201 }
  );
}
