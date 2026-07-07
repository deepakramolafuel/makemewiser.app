"use client";

import { useState, useEffect, useCallback } from "react";
import LessonCard from "./LessonCard";
import SubmitLessonForm from "./SubmitLessonForm";
import RateLimitMessage from "./RateLimitMessage";
import Footer from "./Footer";
import HeroIllustration from "./illustrations/HeroIllustration";
import HeroIllustrationCrane from "./illustrations/HeroIllustrationCrane";
import TravelLoader from "./TravelLoader";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useSessionLessons } from "@/hooks/useSessionLessons";
import { getRandomLesson } from "@/lib/api";
import type { LessonResponse } from "@/lib/types";
import { track } from "@/lib/analytics";

type View = "home" | "travelling" | "lesson" | "submit";

const MIN_TRAVEL_DURATION = 4500; // minimum ms to show travel animation

// Pick the hero illustration based on the build-time default or a runtime
// override via ?hero=1|2. Lets Deepak A/B between variants without redeploying.
const DEFAULT_HERO: 1 | 2 = process.env.NEXT_PUBLIC_HERO_VARIANT === "2" ? 2 : 1;

export default function HomeScreen() {
  const [view, setView] = useState<View>("home");
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [pendingLesson, setPendingLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [heroVariant, setHeroVariant] = useState<1 | 2>(DEFAULT_HERO);

  const { isLimited, recordTap } = useRateLimit();
  const { seenIds, markSeen } = useSessionLessons();

  // Allow ?hero=1 / ?hero=2 to override the default for quick A/B previews.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("hero");
    if (param === "1") setHeroVariant(1);
    if (param === "2") setHeroVariant(2);
  }, []);

  // Transition from travelling → lesson after animation completes
  useEffect(() => {
    if (view !== "travelling" || !pendingLesson) return;

    const timer = setTimeout(() => {
      setLesson(pendingLesson);
      setPendingLesson(null);
      setView("lesson");
    }, MIN_TRAVEL_DURATION);

    return () => clearTimeout(timer);
  }, [view, pendingLesson]);

  const fetchLesson = useCallback(async () => {
    // Honour rate limit from any entry point (initial tap and "Make me wiser again")
    if (isLimited) {
      setView("home");
      return;
    }

    setLoading(true);
    setApiError(false);

    const data = await getRandomLesson(seenIds);

    if (!data) {
      setLoading(false);
      setApiError(true);
      setView("home");
      return;
    }

    markSeen(data.id);
    recordTap();

    // Show the travelling animation
    setPendingLesson(data);
    setView("travelling");
    setLoading(false);
  }, [isLimited, seenIds, markSeen, recordTap]);

  function handleMakeWiser() {
    track("make_me_wiser");
    fetchLesson();
  }

  // ─── Home view ───────────────────────────────────────────────────────
  if (view === "home") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen px-5 pt-16">
        <div className="flex flex-col items-center gap-2 w-full max-w-lg">
          {/* Subline above title */}
          <p className="text-sm text-secondary tracking-wide text-center">
            Life Lessons from 195 countries
          </p>

          {/* App name */}
          <h1 className="font-serif text-5xl md:text-6xl text-primary text-center leading-tight">
            Make Me Wiser
          </h1>

          {/* Hero illustration — variant selected via ?hero=1|2 or env default */}
          <div className="my-8 w-full">
            {heroVariant === 2 ? <HeroIllustrationCrane /> : <HeroIllustration />}
          </div>

          {/* API error */}
          {apiError && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 text-center mb-4">
              Something went wrong. Tap to try again.
            </p>
          )}

          {/* Rate limit reached */}
          {isLimited ? (
            <RateLimitMessage onDone={() => setView("submit")} />
          ) : (
            <>
              {/* Action buttons */}
              <div className="flex gap-3 justify-center w-full">
                <button
                  onClick={handleMakeWiser}
                  disabled={loading}
                  className="flex-1 max-w-[200px] py-3.5 bg-button-fill text-cream text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "Finding..." : "Make me wiser"}
                </button>
                <button
                  onClick={() => { track("share_lesson_open"); setView("submit"); }}
                  className="flex-1 max-w-[200px] py-3.5 border border-primary text-primary text-sm tracking-wide hover:bg-primary hover:text-cream transition-colors whitespace-nowrap"
                >
                  Share my lesson
                </button>
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    );
  }

  // ─── Travelling view — animated transition ─────────────────────────
  if (view === "travelling" && pendingLesson) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen px-5">
        <TravelLoader country={pendingLesson.country} />
      </div>
    );
  }

  // ─── Lesson view ──────────────────────────────────────────────────────
  if (view === "lesson" && lesson) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen px-5 py-10">
        {/* Title stays visible */}
        <h1 className="font-serif text-3xl text-primary text-center mb-8">
          Make Me Wiser
        </h1>

        <LessonCard
          lesson={lesson}
          onNext={fetchLesson}
          onDone={() => setView("home")}
          loading={loading}
        />

        <Footer />
      </div>
    );
  }

  // ─── Submit view ──────────────────────────────────────────────────────
  if (view === "submit") {
    return (
      <div className="flex flex-col flex-1 items-center min-h-screen px-5 py-10">
        {/* Title stays visible */}
        <h1 className="font-serif text-3xl text-primary text-center mb-8">
          Make Me Wiser
        </h1>

        <SubmitLessonForm
          onMakeWiser={() => { setView("home"); handleMakeWiser(); }}
          onBack={() => setView("home")}
        />

        <Footer />
      </div>
    );
  }

  return null;
}
