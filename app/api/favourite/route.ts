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

  // Hash the IP for server-side dedup. Same (lesson, ip) pair can favourite once.
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  // Atomically dedup-insert + increment via RPC; returns current count either way.
  const { data, error } = await supabase.rpc("increment_favourite", {
    p_lesson_id: lessonId,
    p_ip_hash:   ipHash,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to favourite" }, { status: 500 });
  }

  return NextResponse.json({ favourite_count: data });
}
