"use client";

import { useState, useEffect } from "react";

interface TravelLoaderProps {
  country: string;
}

export default function TravelLoader({ country }: TravelLoaderProps) {
  const [phase, setPhase] = useState<"path" | "country">("path");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("country"), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 animate-fade-in-up">
      {/* Animated envelope travelling along a path */}
      <svg
        viewBox="0 0 300 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-64 mx-auto"
        aria-hidden="true"
      >
        {/* The path the envelope travels */}
        <path
          d="M 30 60 C 80 20, 140 100, 200 50 C 230 30, 260 70, 280 55"
          stroke="#E5E0D8"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Dotted trail behind envelope */}
        <path
          d="M 30 60 C 80 20, 140 100, 200 50 C 230 30, 260 70, 280 55"
          stroke="#2C2C2C"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 6"
          fill="none"
          className="animate-draw-path"
        />

        {/* Small decorative stars along the way */}
        <g className="animate-twinkle" style={{ animationDelay: "0.3s" }}>
          <path d="M 100 30 L 101.5 34 L 106 35.5 L 101.5 37 L 100 41 L 98.5 37 L 94 35.5 L 98.5 34 Z" fill="none" stroke="#2C2C2C" strokeWidth="0.8" />
        </g>
        <g className="animate-twinkle" style={{ animationDelay: "0.9s" }}>
          <path d="M 220 80 L 221.5 84 L 226 85.5 L 221.5 87 L 220 91 L 218.5 87 L 214 85.5 L 218.5 84 Z" fill="none" stroke="#2C2C2C" strokeWidth="0.8" />
        </g>

        {/* The travelling envelope */}
        <g className="animate-travel-envelope">
          <rect x="-12" y="-8" width="24" height="16" rx="1" stroke="#2C2C2C" strokeWidth="1.2" fill="#FAF7F2" />
          <path d="M -12 -8 L 0 2 L 12 -8" stroke="#2C2C2C" strokeWidth="1.2" fill="none" />
        </g>
      </svg>

      {/* Travel text */}
      <div className={`text-center transition-opacity duration-700 ${phase === "country" ? "opacity-100" : "opacity-0"}`}>
        <p className="text-sm text-secondary italic leading-relaxed">
          This lesson has travelled from
        </p>
        <p className="font-serif text-xl text-primary mt-1">
          {country}
        </p>
        <p className="text-sm text-secondary italic mt-1">
          to you.
        </p>
      </div>
    </div>
  );
}
