import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

// POST /api/subscribe  { email, source?, referrer? }
// 1) Save the email in our own Supabase first (so we never lose a lead, and
//    keep a subscriber count we own independent of Substack).
// 2) Forward to Substack server-side (avoids CORS, keeps the flow inline).
// If Substack requires a captcha or fails, we signal `fallback: true` and the
// client opens the prefilled Substack subscribe page.

const SUBSTACK = "https://5minsoffuel.substack.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function forwardToSubstack(email: string): Promise<"sent" | "fallback"> {
  try {
    const res = await fetch(`${SUBSTACK}/api/v1/free`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email,
        first_url: SUBSTACK,
        first_referrer: "https://wiser.projectfuel.in",
        current_url: SUBSTACK,
        current_referrer: "https://wiser.projectfuel.in",
        referral_code: "",
        source: "embed",
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return data?.requires_captcha ? "fallback" : "sent";
    }
    return "fallback";
  } catch {
    return "fallback";
  }
}

export async function POST(request: NextRequest) {
  let email = "";
  let source = "footer";
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    if (body?.source) source = String(body.source).slice(0, 60);
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const referrer = request.headers.get("referer")?.slice(0, 300) ?? null;
  const supabase = createServiceClient();

  // 1) Save first — dedup on email, keep the earliest signup.
  await supabase
    .from("subscribers")
    .upsert(
      { email, source, referrer, substack_status: "pending" },
      { onConflict: "email", ignoreDuplicates: true }
    );

  // 2) Forward to Substack.
  const status = await forwardToSubstack(email);

  // 3) Record the outcome (best-effort).
  await supabase.from("subscribers").update({ substack_status: status }).eq("email", email);

  if (status === "sent") {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, fallback: true });
}
