"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

const SUBSTACK = "https://5minsoffuel.substack.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type State = "idle" | "loading" | "done" | "error";

export default function SubscribeCTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setState("error");
      return;
    }

    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json().catch(() => ({}));

      if (data?.ok) {
        track("subscribed", { via: "inline" });
        setState("done");
        return;
      }

      // Substack needs a captcha or the proxy failed — open the hosted page
      // with the email prefilled so the reader finishes in one click.
      if (data?.fallback) {
        track("subscribed", { via: "fallback" });
        window.open(
          `${SUBSTACK}/subscribe?email=${encodeURIComponent(value)}`,
          "_blank",
          "noopener,noreferrer"
        );
        setState("done");
        return;
      }

      setState("error");
    } catch {
      track("subscribed", { via: "fallback" });
      window.open(
        `${SUBSTACK}/subscribe?email=${encodeURIComponent(value)}`,
        "_blank",
        "noopener,noreferrer"
      );
      setState("done");
    }
  }

  if (state === "done") {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <p className="text-sm text-primary font-serif italic">
          You&rsquo;re in. Wisdom is on its way. ✦
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <p className="text-xs text-secondary tracking-wide mb-3">
        Want more of this wisdom in your inbox?
      </p>
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="your@email.com"
          className="flex-1 border-b border-card-border bg-transparent py-1.5 text-sm text-primary placeholder:text-secondary/60 focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="px-5 py-2 bg-button-fill text-cream text-xs tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
        >
          {state === "loading" ? "…" : "Subscribe"}
        </button>
      </form>
      {state === "error" && (
        <p className="text-xs text-amber-700 mt-2">
          Please enter a valid email.
        </p>
      )}
    </div>
  );
}
