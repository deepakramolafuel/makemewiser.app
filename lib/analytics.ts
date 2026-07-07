// Unified analytics: one call fans out to PostHog (funnels, session insight)
// and Vercel Web Analytics (traffic + sources). Both are no-ops when their
// env keys aren't configured, so this is safe to call anywhere client-side.

import { track as vercelTrack } from "@vercel/analytics";
import posthog from "posthog-js";

const PH_ENABLED = !!process.env.NEXT_PUBLIC_POSTHOG_KEY;

type Props = Record<string, string | number | boolean>;

export function track(event: string, props?: Props) {
  try {
    vercelTrack(event, props);
  } catch {
    /* ignore */
  }
  if (PH_ENABLED && typeof window !== "undefined") {
    try {
      posthog.capture(event, props);
    } catch {
      /* ignore */
    }
  }
}

// Tie an anonymous visitor to their email once they subscribe, so the whole
// journey (viewed → made-wiser → subscribed) links to one person in PostHog.
export function identify(email: string) {
  if (PH_ENABLED && typeof window !== "undefined") {
    try {
      posthog.identify(email, { email });
    } catch {
      /* ignore */
    }
  }
}
