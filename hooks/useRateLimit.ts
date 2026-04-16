"use client";

import { useState } from "react";

const LIMIT = 10;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = "mmw_rate_limit";

interface RateLimitState {
  count: number;
  firstTapAt: number | null;
}

function readFromStorage(): RateLimitState {
  if (typeof window === "undefined") return { count: 0, firstTapAt: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, firstTapAt: null };
    const stored: RateLimitState = JSON.parse(raw);
    // Reset if 24-hour window has expired
    if (stored.firstTapAt && Date.now() - stored.firstTapAt > WINDOW_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return { count: 0, firstTapAt: null };
    }
    return stored;
  } catch {
    return { count: 0, firstTapAt: null };
  }
}

export function useRateLimit() {
  // Lazy initializer reads localStorage once on mount (client only)
  const [state, setState] = useState<RateLimitState>(readFromStorage);
  const [isLimited, setIsLimited] = useState(() => readFromStorage().count >= LIMIT);

  function recordTap() {
    setState((prev) => {
      const now = Date.now();
      const newState: RateLimitState = {
        count: prev.count + 1,
        firstTapAt: prev.firstTapAt ?? now,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch {
        // ignore
      }
      if (newState.count >= LIMIT) setIsLimited(true);
      return newState;
    });
  }

  return { isLimited, count: state.count, limit: LIMIT, recordTap };
}
