import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from './supabase/server';

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Extracts the Bearer token from the Authorization header.
 * Returns null if the header is missing or malformed.
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7).trim() || null;
}

/**
 * Validates the Bearer token and returns the authenticated user.
 * Throws a NextResponse with status 401 if unauthenticated.
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const token = getTokenFromRequest(request);

  if (!token) {
    throw NextResponse.json(
      { error: 'Missing or invalid Authorization header.' },
      { status: 401 }
    );
  }

  const supabase = createAdminClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw NextResponse.json(
      { error: 'Invalid or expired token. Please log in again.' },
      { status: 401 }
    );
  }

  return { id: user.id, email: user.email ?? '' };
}
