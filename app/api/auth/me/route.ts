import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getTokenFromRequest } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ authed: false });
  }

  const supabase = createAdminClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ authed: false });
  }

  return NextResponse.json({
    authed: true,
    user: { id: user.id, email: user.email ?? '' },
  });
}
