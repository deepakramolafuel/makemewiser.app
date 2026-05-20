"use client";

// "The Flight Path" — a paper plane wanders an infinity loop.
// At each waypoint a country card blooms, with a contributor's
// name underneath. Constellation lines tie the background.

import { useEffect, useState } from "react";

const FP_TRAIL =
  "M 100 250 C 100 100, 350 100, 450 250 C 550 400, 800 400, 800 250 C 800 100, 550 100, 450 250 C 350 400, 100 400, 100 250 Z";

type Side = "below" | "above" | "left" | "right";

const FP_WAYPOINTS: { x: number; y: number; side: Side }[] = [
  { x: 100, y: 250, side: "above" },
  { x: 315, y: 150, side: "right" },
  { x: 585, y: 350, side: "right" },
  { x: 800, y: 250, side: "above" },
  { x: 585, y: 150, side: "left"  },
  { x: 315, y: 350, side: "left"  },
];

const FP_SPARKLES = [
  { x: 60,  y: 60,  s: 11, d: 0   },
  { x: 840, y: 60,  s: 9,  d: 1.2 },
  { x: 450, y: 50,  s: 7,  d: 0.6 },
  { x: 450, y: 450, s: 8,  d: 2.0 },
  { x: 60,  y: 440, s: 10, d: 1.5 },
  { x: 840, y: 440, s: 6,  d: 0.3 },
  { x: 200, y: 250, s: 6,  d: 2.4 },
  { x: 700, y: 250, s: 6,  d: 0.9 },
];

const FP_CONSTELLATION: { x1: number; y1: number; x2: number; y2: number }[] = [
  { x1: 60,  y1: 60,  x2: 450, y2: 50  },
  { x1: 450, y1: 50,  x2: 840, y2: 60  },
  { x1: 60,  y1: 440, x2: 450, y2: 450 },
  { x1: 450, y1: 450, x2: 840, y2: 440 },
  { x1: 60,  y1: 60,  x2: 200, y2: 250 },
  { x1: 840, y1: 60,  x2: 700, y2: 250 },
  { x1: 60,  y1: 440, x2: 200, y2: 250 },
  { x1: 840, y1: 440, x2: 700, y2: 250 },
];

const CYCLE = 24;

const FALLBACK_COUNTRIES = ["Japan", "India", "Brazil", "Kenya", "Iceland", "Peru"];
const FALLBACK_NAMES = ["Aida", "Jiro", "Mateus", "Sara", "Niamh", "Tomás", "Lin", "Kofi"];

function Sparkle({ size, opacity = 1 }: { size: number; opacity?: number }) {
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`-${r} -${r} ${size} ${size}`}
      fill="none"
      stroke="#2C2C2C"
      strokeWidth="0.9"
      strokeLinejoin="round"
      style={{ opacity, display: "block" }}
    >
      <path d={`M 0 -${r} L 1.2 -1.2 L ${r} 0 L 1.2 1.2 L 0 ${r} L -1.2 1.2 L -${r} 0 L -1.2 -1.2 Z`} />
    </svg>
  );
}

function pickRandom<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// One country card. Owns an exclusive chunk of contributor names
// and rotates through them on each animation iteration.
function CountryCard({
  waypoint,
  country,
  names,
  slotIndex,
  totalSlots,
  delay,
}: {
  waypoint: { x: number; y: number; side: Side };
  country: string;
  names: string[];
  slotIndex: number;
  totalSlots: number;
  delay: number;
}) {
  const chunkSize = Math.max(1, Math.floor(names.length / totalSlots));
  const start = slotIndex * chunkSize;
  const myNames = names.slice(start, start + chunkSize);
  const safeNames = myNames.length
    ? myNames
    : names.length
      ? [names[slotIndex % names.length]]
      : [""];

  const [iter, setIter] = useState(0);
  const person = safeNames[iter % safeNames.length];

  return (
    <div
      className={`fp-card side-${waypoint.side}`}
      style={{
        left: `${(waypoint.x / 900) * 100}%`,
        top: `${(waypoint.y / 500) * 100}%`,
        animationDelay: `${delay}s`,
      }}
      onAnimationIteration={() => setIter((i) => i + 1)}
    >
      <div className="fp-card-inner">
        <div className="fp-card-country">{country}</div>
        <div className="fp-card-person">— {person}</div>
      </div>
    </div>
  );
}

export default function HeroIllustration() {
  const [countries, setCountries] = useState<string[]>(FALLBACK_COUNTRIES);
  const [names, setNames] = useState<string[]>(FALLBACK_NAMES);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/countries")
      .then((r) => r.json())
      .then((data: { countries?: string[] }) => {
        if (cancelled || !data.countries?.length) return;
        setCountries(pickRandom(data.countries, FP_WAYPOINTS.length));
      })
      .catch(() => {});

    fetch("/api/contributors")
      .then((r) => r.json())
      .then((data: { names?: string[] }) => {
        if (cancelled || !data.names?.length) return;
        setNames(shuffle(data.names));
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  const countryLabels = FP_WAYPOINTS.map((_, i) => countries[i % countries.length] ?? "");

  return (
    <div className="fp-stage relative w-full mx-auto">

      {/* BACKGROUND SVG */}
      <svg
        className="fp-svg absolute inset-0 w-full h-full"
        viewBox="0 0 900 500"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <g className="fp-constellation">
          {FP_CONSTELLATION.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>

        <path id="fp-trail-path" d={FP_TRAIL} className="fp-trail" fill="none" />
        <path d={FP_TRAIL} className="fp-wake" fill="none" />

        {FP_WAYPOINTS.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            className="fp-waypoint"
            style={{ animationDelay: `${((i * CYCLE) / FP_WAYPOINTS.length).toFixed(2)}s` }}
          />
        ))}
      </svg>

      {/* Country cards (each carries a rotating contributor name) */}
      {FP_WAYPOINTS.map((p, i) => (
        <CountryCard
          key={i}
          waypoint={p}
          country={countryLabels[i]}
          names={names}
          slotIndex={i}
          totalSlots={FP_WAYPOINTS.length}
          delay={(i * CYCLE) / FP_WAYPOINTS.length}
        />
      ))}

      {/* Sparkles */}
      {FP_SPARKLES.map((s, i) => (
        <div
          key={i}
          className="fp-sparkle"
          style={{
            left: `${(s.x / 900) * 100}%`,
            top: `${(s.y / 500) * 100}%`,
            animationDelay: `${s.d}s`,
          }}
        >
          <Sparkle size={s.s} />
        </div>
      ))}

      {/* FOREGROUND SVG: just the paper plane */}
      <svg
        className="fp-svg absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 900 500"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <path id="fp-crane-path" d={FP_TRAIL} fill="none" stroke="none" />
        <g className="fp-crane">
          <g>
            {/* paper plane — dart silhouette, viewed from above */}
            <path d="M 42 0 L -22 -22 L -10 0 L -22 22 Z" />
            {/* center fuselage crease */}
            <path d="M 42 0 L -10 0" strokeWidth="0.7" strokeOpacity="0.55" />
            {/* faint wing creases for paper feel */}
            <path d="M 16 -10 L -12 -4" strokeWidth="0.5" strokeOpacity="0.35" />
            <path d="M 16 10 L -12 4" strokeWidth="0.5" strokeOpacity="0.35" />
          </g>
          <animateMotion dur={`${CYCLE}s`} repeatCount="indefinite" rotate="auto">
            <mpath href="#fp-crane-path" />
          </animateMotion>
        </g>
      </svg>
    </div>
  );
}
