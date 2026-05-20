import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

// GET /api/countries → { countries: string[] }
// Returns distinct country names from approved, non-reported lessons.
export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("country")
    .eq("is_approved", true)
    .eq("is_reported", false);

  if (error) {
    return NextResponse.json({ countries: [], error: error.message }, { status: 500 });
  }

  const EXCLUDED = new Set(["North Korea"]);
  const unique = Array.from(new Set(data.map((row) => row.country)))
    .filter((c) => c && c.length < 15 && !EXCLUDED.has(c))
    .sort();
  return NextResponse.json({ countries: unique });
}
