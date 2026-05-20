import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createServiceClient();

  // Single-round-trip aggregate; avoids pulling every country column client-side.
  const { data, error } = await supabase.rpc("lesson_stats");

  if (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }

  const row = Array.isArray(data) ? data[0] : data;

  return NextResponse.json({
    total_lessons:   Number(row?.total_lessons   ?? 0),
    total_countries: Number(row?.total_countries ?? 0),
  });
}
