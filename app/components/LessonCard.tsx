"use client";

import { useState } from "react";
import type { LessonResponse } from "@/lib/types";
import TriggerWarning from "./TriggerWarning";
import StoryExpand from "./StoryExpand";
import LessonActions from "./LessonActions";
import ShareImageGenerator from "./ShareImageGenerator";
import CountryMotif from "./illustrations/CountryMotif";

interface LessonCardProps {
  lesson: LessonResponse;
  onNext: () => void;
  onDone: () => void;
  loading: boolean;
}

export default function LessonCard({ lesson, onNext, onDone, loading }: LessonCardProps) {
  const [showShare, setShowShare] = useState(false);

  const attribution = [
    lesson.person_name,
    lesson.person_age ? `Age ${lesson.person_age}` : null,
    lesson.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="w-full max-w-lg animate-seed-unfurl">
        {/* Country motif — warm, organic, honors the place */}
        <div className="flex justify-center mb-6">
          <CountryMotif country={lesson.country} />
        </div>

        {/* Card — thin black border */}
        <div className="border border-primary bg-cream p-8">
          {/* Trigger warning tag */}
          {lesson.trigger_warning && (
            <div className="mb-4">
              <TriggerWarning keyword={lesson.trigger_warning} />
            </div>
          )}

          {/* Life lesson text — large serif */}
          <blockquote className="font-serif text-2xl md:text-3xl leading-snug text-primary text-center px-2 mb-6">
            {lesson.life_lesson}&nbsp;~
          </blockquote>

          {/* Attribution — name, age, country together */}
          <p className="text-xs text-secondary text-center tracking-wide mb-6">
            — {attribution}
          </p>

          {/* Actions: favourite, share, report */}
          <LessonActions lesson={lesson} onShare={() => setShowShare(true)} />
        </div>

        {/* Story expand — below the card border */}
        <div className="px-2 mt-4">
          <StoryExpand story={lesson.story} country={lesson.country} />
        </div>

        {/* Travel line — always visible */}
        <p className="text-xs text-secondary italic text-center mt-6 px-4">
          This lesson has travelled from {lesson.country} to you.
        </p>

        {/* Navigation buttons */}
        <div className="flex gap-3 justify-center mt-8">
          <button
            onClick={onNext}
            disabled={loading}
            className="flex-1 max-w-[200px] py-3.5 bg-button-fill text-cream text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Finding..." : "Make me wiser again"}
          </button>
          <button
            onClick={onDone}
            className="flex-1 max-w-[200px] py-3.5 border border-primary text-primary text-sm tracking-wide hover:bg-primary hover:text-cream transition-colors whitespace-nowrap"
          >
            Done
          </button>
        </div>
      </div>

      {/* Share image modal */}
      {showShare && (
        <ShareImageGenerator lesson={lesson} onClose={() => setShowShare(false)} />
      )}
    </>
  );
}
