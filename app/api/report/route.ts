import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const lessonId = body?.lesson_id;

  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "lesson_id is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Hash the IP for lightweight duplicate-report tracking (server-side backup to localStorage)
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  // Insert the report
  const { error: insertError } = await supabase
    .from("reports")
    .insert({ lesson_id: lessonId, ip_hash: ipHash });

  if (insertError) {
    return NextResponse.json({ error: "Failed to report" }, { status: 500 });
  }

  // Increment report_count and auto-hide at 3 reports
  const { data: lesson, error: fetchError } = await supabase
    .from("lessons")
    .select("report_count")
    .eq("id", lessonId)
    .single();

  if (!fetchError && lesson) {
    const newCount = (lesson.report_count ?? 0) + 1;
    await supabase
      .from("lessons")
      .update({
        report_count: newCount,
        // Auto-hide after 3 reports
        ...(newCount >= 3 ? { is_reported: true } : {}),
      })
      .eq("id", lessonId);
  }

  return NextResponse.json({ reported: true });
}
