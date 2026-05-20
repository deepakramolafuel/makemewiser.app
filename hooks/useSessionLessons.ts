"use client";

import { useState } from "react";

const STORAGE_KEY = "mmw_session_lessons";
// Cap so the exclude list stays bounded and the server's IN-array doesn't grow unbounded.
const MAX_SEEN = 100;

export function useSessionLessons() {
  // Lazy initializer reads sessionStorage once on mount (client only)
  const [seenIds, setSeenIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.slice(-MAX_SEEN) : [];
    } catch {
      return [];
    }
  });

  function markSeen(lessonId: string) {
    setSeenIds((prev) => {
      const next = [...prev, lessonId].slice(-MAX_SEEN);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  return { seenIds, markSeen };
}
