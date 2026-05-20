import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

// GET /api/contributors → { names: string[] }
// Returns distinct first names from approved, non-reported lessons.
// Used by the hero illustration for the "floating names" layer.
export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("person_name")
    .eq("is_approved", true)
    .eq("is_reported", false);

  if (error) {
    return NextResponse.json({ names: [], error: error.message }, { status: 500 });
  }

  // First name only — keeps it intimate and visually clean
  const firstNames = data
    .map((row) => (row.person_name ?? "").trim().split(/\s+/)[0])
    .filter((name) => name && name.length > 1 && name.length < 16);

  const unique = Array.from(new Set(firstNames)).sort();
  return NextResponse.json({ names: unique });
}
