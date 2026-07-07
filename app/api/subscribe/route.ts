import { NextRequest, NextResponse } from "next/server";

// POST /api/subscribe  { email }
// Server-side proxy to the Substack free-subscription endpoint. Doing this on
// the server avoids the browser CORS block and keeps the flow inline (no redirect
// in the happy path). If Substack requires a captcha or the call fails, we signal
// `fallback: true` and the client opens the prefilled Substack subscribe page.

const SUBSTACK = "https://5minsoffuel.substack.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let email = "";
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  try {
    const res = await fetch(`${SUBSTACK}/api/v1/free`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email,
        first_url: SUBSTACK,
        first_referrer: "https://wiser.projectfuel.in",
        current_url: SUBSTACK,
        current_referrer: "https://wiser.projectfuel.in",
        referral_code: "",
        source: "embed",
      }),
      // Don't hang the request path if Substack is slow
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      // Substack may accept the request but require a captcha to confirm.
      if (data?.requires_captcha) {
        return NextResponse.json({ ok: false, fallback: true });
      }
      return NextResponse.json({ ok: true });
    }

    // Non-2xx from Substack — let the client fall back to the hosted page.
    return NextResponse.json({ ok: false, fallback: true });
  } catch {
    return NextResponse.json({ ok: false, fallback: true });
  }
}
