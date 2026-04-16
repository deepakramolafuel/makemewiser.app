import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createServiceClient();

  const { count: total_lessons, error: lessonError } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true)
    .eq("is_reported", false);

  if (lessonError) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }

  // Count distinct countries among approved lessons
  const { data: countryData, error: countryError } = await supabase
    .from("lessons")
    .select("country")
    .eq("is_approved", true)
    .eq("is_reported", false);

  if (countryError) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }

  const uniqueCountries = new Set(countryData?.map((r) => r.country) ?? []);

  return NextResponse.json({
    total_lessons: total_lessons ?? 0,
    total_countries: uniqueCountries.size,
  });
}
