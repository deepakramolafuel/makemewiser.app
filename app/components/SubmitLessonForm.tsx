"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { COUNTRIES } from "@/lib/countries";
import { submitLesson } from "@/lib/api";
import ConfirmationScreen from "./ConfirmationScreen";

interface SubmitLessonFormProps {
  onMakeWiser: () => void;
  onBack: () => void;
}

export default function SubmitLessonForm({ onMakeWiser, onBack }: SubmitLessonFormProps) {
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const [form, setForm] = useState({
    person_name: "",
    person_age: "",
    country: "",
    life_lesson: "",
    story: "",
  });

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.person_name.trim()) return setError("Name is required.");
    if (!form.person_age || isNaN(Number(form.person_age))) return setError("A valid age is required.");
    if (!form.country) return setError("Please select your country.");
    if (!form.life_lesson.trim()) return setError("Life lesson is required.");
    if (!form.story.trim()) return setError("Story is required.");

    setSubmitting(true);
    const result = await submitLesson({
      person_name: form.person_name.trim(),
      person_age: Number(form.person_age),
      country: form.country,
      life_lesson: form.life_lesson.trim(),
      story: form.story.trim(),
    });
    setSubmitting(false);

    if (!result.approved) {
      setError(result.message ?? "Something went wrong. Please try again.");
      return;
    }

    track("lesson_submitted", { country: form.country });
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <ConfirmationScreen
        onMakeWiser={onMakeWiser}
        onShareAnother={() => {
          setConfirmed(false);
          setForm({ person_name: "", person_age: "", country: "", life_lesson: "", story: "" });
          setCountrySearch("");
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-lg animate-fade-in-up">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm text-primary" htmlFor="person_name">Your name</label>
          </div>
          <input
            id="person_name"
            type="text"
            maxLength={50}
            value={form.person_name}
            onChange={(e) => set("person_name", e.target.value)}
            className="w-full px-0 py-3 border-b border-card-border bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-secondary/50"
            placeholder="e.g. Deepak"
          />
        </div>

        {/* Age + Country row */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-primary mb-2 block" htmlFor="person_age">Your age</label>
            <input
              id="person_age"
              type="number"
              min={1}
              max={120}
              value={form.person_age}
              onChange={(e) => set("person_age", e.target.value)}
              className="w-full px-0 py-3 border-b border-card-border bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-secondary/50"
              placeholder="e.g. 30"
            />
          </div>

          {/* Country — searchable */}
          <div className="relative">
            <label className="text-sm text-primary mb-2 block">Your country</label>
            <input
              type="text"
              value={form.country || countrySearch}
              onChange={(e) => {
                setCountrySearch(e.target.value);
                set("country", "");
                setCountryOpen(true);
              }}
              onFocus={() => setCountryOpen(true)}
              onBlur={() => setTimeout(() => setCountryOpen(false), 150)}
              className="w-full px-0 py-3 border-b border-card-border bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-secondary/50"
              placeholder="Search..."
            />
            {countryOpen && filteredCountries.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-cream border border-card-border shadow-lg max-h-48 overflow-y-auto">
                {filteredCountries.slice(0, 20).map((c) => (
                  <li
                    key={c}
                    onMouseDown={() => {
                      set("country", c);
                      setCountrySearch(c);
                      setCountryOpen(false);
                    }}
                    className="px-3 py-2.5 text-sm text-primary hover:bg-card-border/50 cursor-pointer"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Life lesson */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm text-primary" htmlFor="life_lesson">Your life lesson</label>
            <span className="text-xs text-secondary">{form.life_lesson.length}/200</span>
          </div>
          <textarea
            id="life_lesson"
            maxLength={200}
            rows={2}
            value={form.life_lesson}
            onChange={(e) => set("life_lesson", e.target.value)}
            className="w-full px-0 py-3 border-b border-card-border bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-secondary/50"
            placeholder="What did life teach you?"
          />
        </div>

        {/* Story */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm text-primary" htmlFor="story">The story behind it</label>
            <span className="text-xs text-secondary">{form.story.length}/2000</span>
          </div>
          <textarea
            id="story"
            maxLength={2000}
            rows={6}
            value={form.story}
            onChange={(e) => set("story", e.target.value)}
            className="w-full px-0 py-3 border-b border-card-border bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-secondary/50"
            placeholder="What happened? Who was there? What did it cost you to learn this?"
          />
          <div className="mt-3 space-y-1 text-xs text-secondary/70 italic">
            <p>What happened?</p>
            <p>Who was there?</p>
            <p>What did it cost you to learn this?</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-center pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3.5 border border-primary text-primary text-sm tracking-wide hover:bg-primary hover:text-cream transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-button-fill text-cream text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Sharing your lesson..." : "Share my lesson"}
          </button>
        </div>

        {submitting && (
          <p className="text-xs text-secondary text-center pt-2">
            Reviewing your lesson — this takes a few seconds.
          </p>
        )}
      </form>
    </div>
  );
}
