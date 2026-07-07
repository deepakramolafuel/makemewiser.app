"use client";

// PostHog provider — initializes analytics on the client, gated on the
// NEXT_PUBLIC_POSTHOG_KEY env var. When the key is absent (e.g. before it's
// configured), this is a transparent passthrough that renders children as-is.

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!KEY) return;
    posthog.init(KEY, {
      api_host: HOST,
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  }, []);

  if (!KEY) return <>{children}</>;
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
