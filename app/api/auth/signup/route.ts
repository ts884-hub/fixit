import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// ─── POST /api/auth/signup ─────────────────────────────────────────────────
// Public — creates a new manager account and returns an access token.

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { email, password } = body as { email?: string; password?: string };

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

  const supabase = createAdminClient();

  // Create user — email_confirm: true skips verification email for now
  const { error: createError } = await supabase.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password,
    email_confirm: true,
  });

  if (createError) {
    const msg = createError.message.toLowerCase().includes('already registered')
      ? 'An account with this email already exists.'
      : createError.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Sign in immediately so we can return a token
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (signInError || !signInData.session) {
    // Account was created — just redirect to login
    return NextResponse.json(
      { error: 'Account created. Please sign in.', loginRedirect: true },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { token: signInData.session.access_token },
    { status: 201 }
  );
}
