import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. NEVER import into a client component.
 * Used for: Stripe webhooks, no-login client mini-app, signed URLs.
 */
export function createAdminSupabase(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
