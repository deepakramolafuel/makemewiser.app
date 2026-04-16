"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/lib/api";

export default function CounterDisplay() {
  const [stats, setStats] = useState({ total_lessons: 0, total_countries: 0 });

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  if (!stats.total_lessons) return null;

  return (
    <p className="text-xs text-secondary text-center mt-2">
      {stats.total_lessons} life lessons from {stats.total_countries} countries
    </p>
  );
}
