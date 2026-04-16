"use client";

import { useState } from "react";

const STORAGE_KEY = "mmw_session_lessons";

export function useSessionLessons() {
  // Lazy initializer reads sessionStorage once on mount (client only)
  const [seenIds, setSeenIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  function markSeen(lessonId: string) {
    setSeenIds((prev) => {
      const next = [...prev, lessonId];
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
