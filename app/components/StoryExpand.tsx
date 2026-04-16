"use client";

import { useState } from "react";

interface StoryExpandProps {
  story: string;
  country: string;
}

export default function StoryExpand({ story, country }: StoryExpandProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="text-sm text-secondary hover:text-primary transition-colors flex items-center gap-1"
        >
          Read full story <span className="text-xs">↓</span>
        </button>
      ) : (
        <div className="mt-3 space-y-4">
          {/* Story text with preserved line breaks */}
          <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto pr-1">
            {story}
          </p>

          {/* The travel line */}
          <p className="text-xs text-secondary italic border-t border-card-border pt-3">
            This lesson has travelled from {country} to you.
          </p>

          <button
            onClick={() => setExpanded(false)}
            className="text-xs text-secondary hover:text-primary transition-colors"
          >
            ↑ Close story
          </button>
        </div>
      )}
    </div>
  );
}
