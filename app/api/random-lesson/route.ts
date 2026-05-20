import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cap the exclude list so a malicious client can't blow up the query plan.
const MAX_EXCLUDE = 200;

export async function GET(request: NextRequest) {
  const supabase = createServiceClient();

  // Parse + validate comma-separated exclude IDs. Only well-formed UUIDs survive.
  const excludeParam = request.nextUrl.searchParams.get("exclude") ?? "";
  const excludeIds = excludeParam
    .split(",")
    .map((id) => id.trim())
    .filter((id) => UUID_RE.test(id))
    .slice(0, MAX_EXCLUDE);

  const { data, error } = await supabase.rpc("random_lesson", {
    exclude_ids: excludeIds,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch lesson" }, { status: 500 });
  }

  // RPC returns a set; take the first row (or 404 if exhausted).
  const lesson = Array.isArray(data) ? data[0] : data;
  if (!lesson) {
    return NextResponse.json({ error: "No lessons available" }, { status: 404 });
  }

  return NextResponse.json(lesson);
}
