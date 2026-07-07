import { NextRequest, NextResponse } from "next/server";

// Lesson-intake webhook (n8n → Google Sheet). Read from the environment so the
// URL isn't baked into the public repo. The fallback keeps production working
// until N8N_WEBHOOK_URL is set in Vercel; once you rotate the webhook in n8n
// and set that env var, the fallback below can be removed.
const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  "https://wisdommap.app.n8n.cloud/webhook/makemewiser-lesson-intake";

// Optional shared secret. If you enable Header Auth on the n8n webhook node,
// set the header name to "x-webhook-secret" and put the value in this env var —
// requests will then carry it and anonymous POSTs get rejected by n8n.
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

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
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (N8N_WEBHOOK_SECRET) headers["x-webhook-secret"] = N8N_WEBHOOK_SECRET;

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers,
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
