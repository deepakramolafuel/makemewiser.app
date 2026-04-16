import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const supabase = createServiceClient();

  // Parse comma-separated exclude IDs from query string
  const excludeParam = request.nextUrl.searchParams.get("exclude") ?? "";
  const excludeIds = excludeParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  let query = supabase
    .from("lessons")
    .select("id, person_name, person_age, country, life_lesson, story, trigger_warning, favourite_count")
    .eq("is_approved", true)
    .eq("is_reported", false);

  // Exclude already-seen lessons this session
  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  // Random row — efficient enough for up to ~1000 rows
  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch lesson" }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "No lessons available" }, { status: 404 });
  }

  // Pick a random item client-side from results
  const lesson = data[Math.floor(Math.random() * data.length)];

  return NextResponse.json(lesson);
}
