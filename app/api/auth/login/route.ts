import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { email, password } = body as Record<string, unknown>;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required.' }, { status: 400 });
  }
  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'password is required.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message ?? 'Invalid credentials.' },
      { status: 401 }
    );
  }

  // Return the access token so the frontend can store it in localStorage
  // and send it as Authorization: Bearer <token> on protected requests.
  return NextResponse.json({ token: data.session.access_token });
}
