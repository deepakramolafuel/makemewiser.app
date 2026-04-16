import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key
// Used in API route handlers for operations that need to bypass RLS (updates, admin queries)
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}
