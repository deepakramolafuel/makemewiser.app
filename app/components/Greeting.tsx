"use client";

import { useState } from "react";

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning. Ready to get a little wiser?";
  if (hour >= 12 && hour < 17) return "Good afternoon. There's a lesson waiting for you.";
  if (hour >= 17 && hour < 21) return "Good evening. Wisdom arrives best when the day is winding down.";
  return "The world is quiet. A good time to listen.";
}

export default function Greeting() {
  // Lazy initializer runs only on the client, so we always get the user's local time
  const [greeting] = useState(() => {
    if (typeof window === "undefined") return "";
    return getGreeting(new Date().getHours());
  });

  if (!greeting) return null;

  return (
    <p className="text-sm text-secondary italic text-center">{greeting}</p>
  );
}
