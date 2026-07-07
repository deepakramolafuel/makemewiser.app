import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

// GET /api/health — lightweight DB ping.
// Hit daily by a Vercel cron (see vercel.json) so the free-tier Supabase
// project registers activity and never auto-pauses during quiet stretches.
// Also usable as a uptime/health check.
export async function GET() {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("lessons")
    .select("id")
    .limit(1);

  if (error) {
    return NextResponse.json(
      { ok: false, db: "unreachable", error: error.message },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, db: "up", ts: new Date().toISOString() });
}
