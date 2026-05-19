// Hero variant 1 — "The Journey"
// A hand-drawn letter mid-journey: a faint origin globe on the left, a reading
// silhouette on the right, a dashed arc between them, and one envelope (wax
// seal in the brand accent) flying along the arc. Latitude ghost-lines suggest
// a world map without competing with the foreground.

export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 500 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto"
      aria-hidden="true"
    >
      {/* Ghost latitude lines — quiet sense of "the world" */}
      <g opacity="0.22" stroke="#2C2C2C" strokeWidth="0.8" strokeDasharray="2 4" fill="none">
        <path d="M 0 130 Q 250 90 500 130" />
        <path d="M 0 170 Q 250 130 500 170" />
        <path d="M 0 210 Q 250 170 500 210" />
      </g>

      {/* Compass rose — top-left */}
      <g transform="translate(40, 50)" stroke="#8A8478" strokeWidth="0.9" fill="none" strokeLinecap="round">
        <circle r="11" />
        <path d="M 0 -11 L 2 0 L 0 11 L -2 0 Z" fill="#8A8478" />
        <path d="M -11 0 L 0 -2 L 11 0 L 0 2 Z" />
        <text x="0" y="-15" fontSize="6" fill="#8A8478" textAnchor="middle" stroke="none">N</text>
      </g>

      {/* Origin globe — left */}
      <g transform="translate(80, 165)">
        <circle r="36" stroke="#2C2C2C" strokeWidth="1.5" fill="#FAF7F2" />
        {/* longitude curves */}
        <path d="M -36 0 Q 0 -14 36 0" stroke="#2C2C2C" strokeWidth="0.9" fill="none" />
        <path d="M -36 0 Q 0 14 36 0" stroke="#2C2C2C" strokeWidth="0.9" fill="none" />
        <line x1="0" y1="-36" x2="0" y2="36" stroke="#2C2C2C" strokeWidth="0.9" />
        {/* continents as soft hand-drawn blobs */}
        <path d="M -18 -10 Q -10 -6 -14 4 Q -22 6 -18 -10 Z" stroke="#2C2C2C" strokeWidth="0.8" fill="#2C2C2C" fillOpacity="0.12" />
        <path d="M 4 6 Q 16 2 19 12 Q 11 17 4 6 Z" stroke="#2C2C2C" strokeWidth="0.8" fill="#2C2C2C" fillOpacity="0.12" />
        <path d="M -6 16 Q 0 12 8 18 Q 2 22 -6 16 Z" stroke="#2C2C2C" strokeWidth="0.8" fill="#2C2C2C" fillOpacity="0.12" />
      </g>

      {/* "You" — a reading figure on the right */}
      <g transform="translate(415, 165)" stroke="#2C2C2C" strokeWidth="1.4" fill="none" strokeLinecap="round">
        {/* head */}
        <circle cx="0" cy="-32" r="10" fill="#FAF7F2" />
        {/* hair tuft */}
        <path d="M -6 -40 Q 0 -44 6 -40" />
        {/* shoulders + body */}
        <path d="M -16 -20 Q -18 0 -14 18 L 14 18 Q 18 0 16 -20 Q 12 -24 0 -24 Q -12 -24 -16 -20 Z" fill="#FAF7F2" />
        {/* arms cradling the letter */}
        <path d="M -16 -8 L -22 8 L -12 16" />
        <path d="M 16 -8 L 22 8 L 12 16" />
        {/* tiny letter being read */}
        <rect x="-10" y="-2" width="20" height="14" rx="1" fill="#FAF7F2" />
        <path d="M -10 -2 L 0 6 L 10 -2" />
        <line x1="-6" y1="4" x2="6" y2="4" stroke="#8A8478" strokeWidth="0.6" />
        <line x1="-6" y1="7" x2="4" y2="7" stroke="#8A8478" strokeWidth="0.6" />
      </g>

      {/* The travel arc */}
      <path
        d="M 105 160 C 180 80, 320 240, 395 150"
        stroke="#2C2C2C"
        strokeWidth="1"
        strokeDasharray="3 5"
        strokeLinecap="round"
        fill="none"
        className="animate-draw-hero-arc"
      />

      {/* Flying envelope (with wax seal) along the arc */}
      <g className="animate-travel-hero">
        <g transform="translate(-20, -14)">
          <rect width="40" height="28" rx="2" stroke="#2C2C2C" strokeWidth="1.4" fill="#FAF7F2" />
          <path d="M 0 0 L 20 16 L 40 0" stroke="#2C2C2C" strokeWidth="1.4" fill="none" />
          <path d="M 0 28 L 14 16" stroke="#2C2C2C" strokeWidth="1" fill="none" />
          <path d="M 40 28 L 26 16" stroke="#2C2C2C" strokeWidth="1" fill="none" />
          {/* wax seal — only place the brand accent appears */}
          <circle cx="20" cy="15" r="3.6" fill="#A67C5B" stroke="#2C2C2C" strokeWidth="0.5" />
          <path d="M 18.5 14 L 21.5 16 M 18.5 16 L 21.5 14" stroke="#FAF7F2" strokeWidth="0.5" />
        </g>
      </g>

      {/* Twinkling stars at varied heights */}
      <g className="animate-twinkle">
        <path d="M 195 65 L 197 71 L 203 73 L 197 75 L 195 81 L 193 75 L 187 73 L 193 71 Z" fill="none" stroke="#2C2C2C" strokeWidth="1" />
      </g>
      <g className="animate-twinkle" style={{ animationDelay: "0.9s" }}>
        <path d="M 320 60 L 321.5 64 L 326 65.5 L 321.5 67 L 320 71 L 318.5 67 L 314 65.5 L 318.5 64 Z" fill="none" stroke="#2C2C2C" strokeWidth="0.9" />
      </g>
      <g className="animate-twinkle" style={{ animationDelay: "1.5s" }}>
        <path d="M 255 230 L 257 236 L 263 238 L 257 240 L 255 246 L 253 240 L 247 238 L 253 236 Z" fill="none" stroke="#2C2C2C" strokeWidth="1" />
      </g>

      {/* Drifting seed/leaf doodles */}
      <path d="M 160 235 Q 168 225 175 235 Q 168 241 160 235" fill="none" stroke="#2C2C2C" strokeWidth="0.9" className="animate-float" style={{ animationDelay: "0.4s" }} />
      <path d="M 340 240 Q 350 230 360 240 Q 350 246 340 240" fill="none" stroke="#2C2C2C" strokeWidth="0.9" className="animate-float" style={{ animationDelay: "1.2s" }} />

      {/* Tilde signoff in italic serif — Deepak's mark */}
      <text x="455" y="220" fontFamily="Playfair Display, Georgia, serif" fontSize="13" fill="#8A8478" fontStyle="italic" textAnchor="end">
        ~ for you
      </text>
    </svg>
  );
}
