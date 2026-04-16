import { createClient } from "@supabase/supabase-js";

// Browser-side Supabase client with anonymous key
// Used for read-only queries that go through RLS
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
