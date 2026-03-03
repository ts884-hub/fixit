import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getTokenFromRequest } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  // Optionally revoke the session server-side if a token is present
  const token = getTokenFromRequest(request);
  if (token) {
    const supabase = createAdminClient();
    // signOut with the user's token to invalidate the session on Supabase
    await supabase.auth.admin.signOut(token).catch(() => {
      // non-fatal; client will discard the token regardless
    });
  }

  return NextResponse.json({ ok: true });
}
