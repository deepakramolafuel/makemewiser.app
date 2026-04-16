import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const lessonId = body?.lesson_id;

  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "lesson_id is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Atomically increment favourite count via database function
  const { data, error } = await supabase.rpc("increment_favourite", {
    lesson_id: lessonId,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to favourite" }, { status: 500 });
  }

  return NextResponse.json({ favourite_count: data });
}
