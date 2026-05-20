import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  "https://wisdommap.app.n8n.cloud/webhook/makemewiser-lesson-intake";

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

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        person_name: (body.person_name as string).trim(),
        person_age: Number(body.person_age),
        country: (body.country as string).trim(),
        life_lesson: (body.life_lesson as string).trim(),
        story: (body.story as string).trim(),
      }),
    });

    if (!res.ok) {
      throw new Error(`n8n responded ${res.status}`);
    }
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Failed to submit lesson. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ approved: true });
}
