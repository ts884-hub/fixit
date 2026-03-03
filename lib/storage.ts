import { SupabaseClient } from '@supabase/supabase-js';

export const BUCKET = 'ticket-photos';
export const SIGNED_URL_EXPIRY_SECONDS = 60 * 60; // 1 hour

/**
 * Given a storage file path (e.g. "public/uuid.jpg"), returns a
 * time-limited signed URL. Returns null if the path is empty or
 * signing fails.
 */
export async function resolvePhotoUrl(
  supabase: SupabaseClient,
  path: string | null | undefined
): Promise<string | null> {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/**
 * Batch version — resolves signed URLs for an array of tickets.
 * Tickets without a photo_url are returned unchanged.
 * Uses createSignedUrls() for a single round-trip when photos are present.
 */
export async function resolvePhotoUrls<
  T extends { photo_url?: string | null }
>(supabase: SupabaseClient, tickets: T[]): Promise<T[]> {
  // Collect the unique paths that need signing
  const paths = tickets
    .map((t) => t.photo_url)
    .filter((p): p is string => !!p);

  if (paths.length === 0) return tickets;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data) {
    // Non-fatal: return tickets with photo_url nulled out
    return tickets.map((t) => ({ ...t, photo_url: null }));
  }

  // Build a map of path → signedUrl for quick lookup
  // item.path can be string | null per Supabase types, so filter nulls out
  const signedMap = new Map<string, string>(
    data
      .filter((item): item is typeof item & { path: string } => item.path !== null)
      .map((item) => [item.path, item.signedUrl ?? ''])
  );

  return tickets.map((t) => ({
    ...t,
    photo_url: t.photo_url ? (signedMap.get(t.photo_url) ?? null) : null,
  }));
}
