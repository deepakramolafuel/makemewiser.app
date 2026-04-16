import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase-server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Validate submission fields
function validate(body: Record<string, unknown>): string | null {
  if (!body.person_name || typeof body.person_name !== "string" || body.person_name.trim().length === 0)
    return "Name is required.";
  if ((body.person_name as string).length > 50)
    return "Name must be 50 characters or fewer.";
  if (!body.person_age || isNaN(Number(body.person_age)))
    return "A valid age is required.";
  const age = Number(body.person_age);
  if (age < 1 || age > 120)
    return "Age must be between 1 and 120.";
  if (!body.country || typeof body.country !== "string" || body.country.trim().length === 0)
    return "Country is required.";
  if (!body.life_lesson || typeof body.life_lesson !== "string" || body.life_lesson.trim().length === 0)
    return "Life lesson is required.";
  if ((body.life_lesson as string).length > 200)
    return "Life lesson must be 200 characters or fewer.";
  if (!body.story || typeof body.story !== "string" || body.story.trim().length === 0)
    return "Story is required.";
  if ((body.story as string).length > 2000)
    return "Story must be 2000 characters or fewer.";
  return null;
}

// Call Claude API to moderate the submission
async function moderate(
  lifeLesson: string,
  story: string
): Promise<{ approved: boolean; trigger_warning: string | null; rejection_reason: string | null }> {
  const prompt = `You are a content moderator for Make Me Wiser, a life wisdom sharing app by Project FUEL.

Evaluate the following user submission for two things:

1. ABUSE CHECK: Does this contain hate speech, spam, explicit sexual content, threats of violence, personally identifying information of others (phone numbers, addresses, emails), promotional/advertising content, or gibberish/nonsensical text? If yes, reject it.

2. TRIGGER WARNING CHECK: Does this discuss sensitive themes that a reader might want to be prepared for? Sensitive themes include: grief, death, loss, abuse, addiction, mental health struggles, violence, illness, trauma, self-harm, war, displacement, sexual assault. If yes, provide a single keyword tag (e.g., "grief", "addiction", "loss", "trauma", "illness", "violence", "displacement").

Submission:
- Life Lesson: "${lifeLesson.replace(/"/g, "'")}"
- Story: "${story.replace(/"/g, "'")}"

Respond in JSON only:
{
  "approved": true or false,
  "trigger_warning": "keyword" or null,
  "rejection_reason": "brief reason" or null
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 150,
    temperature: 0,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";

  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Run AI moderation
  let moderationResult: { approved: boolean; trigger_warning: string | null; rejection_reason: string | null };

  try {
    moderationResult = await Promise.race([
      moderate(body.life_lesson as string, body.story as string),
      // 10-second timeout
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 10000)
      ),
    ]);
  } catch (err) {
    // Moderation failed or timed out — save as pending review
    console.error("Moderation error:", err);
    await supabase.from("lessons").insert({
      person_name: (body.person_name as string).trim(),
      person_age: Number(body.person_age),
      country: (body.country as string).trim(),
      life_lesson: (body.life_lesson as string).trim(),
      story: (body.story as string).trim(),
      source: "user",
      is_approved: false,
    });

    return NextResponse.json({
      approved: false,
      message:
        "Your lesson has been received and is being reviewed. It will appear shortly.",
    });
  }

  if (!moderationResult.approved) {
    return NextResponse.json({
      approved: false,
      message:
        "We weren't able to publish this lesson. If you believe this is an error, please try rephrasing.",
    });
  }

  // Insert approved lesson
  const { data: newLesson, error: insertError } = await supabase
    .from("lessons")
    .insert({
      person_name: (body.person_name as string).trim(),
      person_age: Number(body.person_age),
      country: (body.country as string).trim(),
      life_lesson: (body.life_lesson as string).trim(),
      story: (body.story as string).trim(),
      trigger_warning: moderationResult.trigger_warning,
      source: "user",
      is_approved: true,
    })
    .select("id")
    .single();

  if (insertError || !newLesson) {
    return NextResponse.json({ error: "Failed to save lesson" }, { status: 500 });
  }

  // Get total contributor count for confirmation screen
  const { count } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("source", "user")
    .eq("is_approved", true);

  return NextResponse.json({
    approved: true,
    lesson_id: newLesson.id,
    total_contributors: count ?? 1,
  });
}
