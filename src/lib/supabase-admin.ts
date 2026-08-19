import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the SERVICE ROLE key, which bypasses RLS.
 *
 * ⚠️ NEVER import this into a Client Component or anything that ships to the
 * browser — the service-role key is a full-access secret. It's read from
 * non-`NEXT_PUBLIC_` env vars so it can only be used on the server.
 *
 * Returns `null` when the env vars are absent, so local dev keeps working
 * without keys (the route falls back to just logging the signup).
 */
let cached: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;
  return cached;
}
