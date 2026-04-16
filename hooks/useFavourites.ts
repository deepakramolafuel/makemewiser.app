"use client";

import { useState } from "react";

const STORAGE_KEY = "mmw_favourites";

export function useFavourites() {
  // Lazy initializer reads localStorage once on mount (client only)
  const [favourited, setFavourited] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  function isFavourited(lessonId: string) {
    return favourited.has(lessonId);
  }

  function addFavourite(lessonId: string) {
    setFavourited((prev) => {
      const next = new Set(prev).add(lessonId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }

  return { isFavourited, addFavourite };
}
