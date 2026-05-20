import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { createHash } from "crypto";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const lessonId = body?.lesson_id;

  if (!lessonId || typeof lessonId !== "string" || !UUID_RE.test(lessonId)) {
    return NextResponse.json({ error: "lesson_id is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Hash the IP for lightweight duplicate-report tracking (server-side backup to localStorage)
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  // Insert the report row
  const { error: insertError } = await supabase
    .from("reports")
    .insert({ lesson_id: lessonId, ip_hash: ipHash });

  if (insertError) {
    return NextResponse.json({ error: "Failed to report" }, { status: 500 });
  }

  // Atomic increment + auto-hide via RPC (no read-then-write race)
  const { error: rpcError } = await supabase.rpc("increment_report_count", {
    p_lesson_id: lessonId,
    p_threshold: 3,
  });

  if (rpcError) {
    return NextResponse.json({ error: "Failed to update report count" }, { status: 500 });
  }

  return NextResponse.json({ reported: true });
}
