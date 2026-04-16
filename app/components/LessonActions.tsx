"use client";

import { useState } from "react";
import { useFavourites } from "@/hooks/useFavourites";
import { favouriteLesson, reportLesson } from "@/lib/api";
import type { LessonResponse } from "@/lib/types";

interface LessonActionsProps {
  lesson: LessonResponse;
  onShare: () => void;
}

export default function LessonActions({ lesson, onShare }: LessonActionsProps) {
  const { isFavourited, addFavourite } = useFavourites();
  const [favouriteCount, setFavouriteCount] = useState(lesson.favourite_count);
  const [reported, setReported] = useState(false);
  const alreadyFavourited = isFavourited(lesson.id);

  async function handleFavourite() {
    if (alreadyFavourited) return;
    addFavourite(lesson.id);
    const result = await favouriteLesson(lesson.id);
    if (result) setFavouriteCount(result.favourite_count);
  }

  async function handleReport() {
    if (reported) return;
    setReported(true);
    await reportLesson(lesson.id);
  }

  return (
    <div className="flex items-center justify-center gap-6 pt-4 text-sm">
      {/* Favourite */}
      <button
        onClick={handleFavourite}
        className={`flex items-center gap-1.5 transition-colors ${
          alreadyFavourited
            ? "text-rose-500 cursor-default"
            : "text-secondary hover:text-rose-500"
        }`}
        aria-label="Favourite this lesson"
      >
        <span>{alreadyFavourited ? "♥" : "♡"}</span>
        <span>{favouriteCount}</span>
      </button>

      {/* Share */}
      <button
        onClick={onShare}
        className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors"
        aria-label="Share this lesson"
      >
        <span>↗</span>
        <span>Share</span>
      </button>

      {/* Report */}
      <button
        onClick={handleReport}
        className={`flex items-center gap-1.5 transition-colors ${
          reported ? "text-secondary cursor-default" : "text-secondary/60 hover:text-secondary"
        }`}
        aria-label="Report this lesson"
      >
        <span>⚑</span>
        <span>{reported ? "Reported" : "Report"}</span>
      </button>
    </div>
  );
}
