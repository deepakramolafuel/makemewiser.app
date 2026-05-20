// Hero variant 2 — "The Crane"
// A single paper crane mid-flight. Behind it, a dashed loop traces the path it
// has flown. Below, scattered tiny letters with brand-accent wax-seal dots —
// the lessons it has carried. Symbolic rather than narrative.

export default function HeroIllustrationCrane() {
  return (
    <svg
      viewBox="0 0 500 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto"
      aria-hidden="true"
    >
      {/* Looped travel trail behind the crane — a soft sky-loop */}
      <path
        d="M 80 200 C 60 140, 140 70, 250 100 C 360 130, 440 70, 420 160 C 410 210, 340 230, 260 215"
        stroke="#2C2C2C"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        className="animate-draw-trail"
        opacity="0.55"
      />

      {/* Twinkling stars — wider sky */}
      <g className="animate-twinkle">
        <path d="M 100 80 L 102 86 L 108 88 L 102 90 L 100 96 L 98 90 L 92 88 L 98 86 Z" fill="none" stroke="#2C2C2C" strokeWidth="1" />
      </g>
      <g className="animate-twinkle" style={{ animationDelay: "0.7s" }}>
        <path d="M 400 70 L 401.5 74 L 406 75.5 L 401.5 77 L 400 81 L 398.5 77 L 394 75.5 L 398.5 74 Z" fill="none" stroke="#2C2C2C" strokeWidth="0.9" />
      </g>
      <g className="animate-twinkle" style={{ animationDelay: "1.3s" }}>
        <path d="M 70 175 L 72 181 L 78 183 L 72 185 L 70 191 L 68 185 L 62 183 L 68 181 Z" fill="none" stroke="#2C2C2C" strokeWidth="0.9" />
      </g>

      {/* The paper crane — centered, gently swaying.
          Outer <g> positions; inner <g> applies CSS sway. Splitting is required
          because a CSS `transform` on the same node would override the SVG
          `transform` attribute and snap the crane to (0,0). */}
      <g transform="translate(250, 140)">
        <g className="animate-crane-sway">
          {/* Body — folded triangular fuselage */}
          <path
            d="M -70 -10 L -10 10 L 50 -5 L 70 8 L 40 22 L -20 22 L -70 -10 Z"
            stroke="#2C2C2C"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="#FAF7F2"
          />
          {/* Fold line down the body */}
          <path d="M -70 -10 L 70 8" stroke="#2C2C2C" strokeWidth="0.9" fill="none" />
          {/* Beak — pointed top-left */}
          <path d="M -70 -10 L -85 -22 L -62 -16 Z" stroke="#2C2C2C" strokeWidth="1.4" fill="#FAF7F2" strokeLinejoin="round" />
          {/* Eye dot */}
          <circle cx="-58" cy="-8" r="1.4" fill="#2C2C2C" />
          {/* Upper wing — flaps slightly */}
          <g className="animate-wing-flap">
            <path d="M -20 -5 L 10 -65 L 45 -8 Z" stroke="#2C2C2C" strokeWidth="1.5" fill="#FAF7F2" strokeLinejoin="round" />
            <path d="M 10 -65 L 12 -8" stroke="#2C2C2C" strokeWidth="0.9" fill="none" />
            <path d="M -10 -20 L 30 -22" stroke="#2C2C2C" strokeWidth="0.7" fill="none" opacity="0.6" />
          </g>
          {/* Lower wing — opposite flap rhythm */}
          <g className="animate-wing-flap" style={{ animationDelay: "1.2s" }}>
            <path d="M -10 18 L 20 70 L 50 18 Z" stroke="#2C2C2C" strokeWidth="1.4" fill="#FAF7F2" strokeLinejoin="round" />
            <path d="M 20 70 L 22 22" stroke="#2C2C2C" strokeWidth="0.9" fill="none" />
          </g>
          {/* Tail — fanned */}
          <path d="M 70 8 L 105 -2 L 102 16 L 95 8 L 100 22 L 88 14 Z" stroke="#2C2C2C" strokeWidth="1.4" fill="#FAF7F2" strokeLinejoin="round" />
        </g>
      </g>

      {/* Scattered letters falling — the lessons the crane has carried */}
      <g transform="translate(70, 230) rotate(-12)" className="animate-float" style={{ animationDelay: "0.2s" }}>
        <rect width="26" height="18" rx="1.5" stroke="#2C2C2C" strokeWidth="1.1" fill="#FAF7F2" />
        <path d="M 0 0 L 13 10 L 26 0" stroke="#2C2C2C" strokeWidth="1.1" fill="none" />
        <circle cx="13" cy="9" r="2.2" fill="#A67C5B" />
      </g>
      <g transform="translate(180, 240) rotate(6)" className="animate-float" style={{ animationDelay: "0.8s" }}>
        <rect width="22" height="15" rx="1.5" stroke="#2C2C2C" strokeWidth="1" fill="#FAF7F2" />
        <path d="M 0 0 L 11 8 L 22 0" stroke="#2C2C2C" strokeWidth="1" fill="none" />
      </g>
      <g transform="translate(280, 245) rotate(-4)" className="animate-float" style={{ animationDelay: "1.4s" }}>
        <rect width="24" height="16" rx="1.5" stroke="#2C2C2C" strokeWidth="1" fill="#FAF7F2" />
        <path d="M 0 0 L 12 9 L 24 0" stroke="#2C2C2C" strokeWidth="1" fill="none" />
        <circle cx="12" cy="8" r="2" fill="#A67C5B" />
      </g>
      <g transform="translate(395, 235) rotate(10)" className="animate-float" style={{ animationDelay: "0.5s" }}>
        <rect width="22" height="15" rx="1.5" stroke="#2C2C2C" strokeWidth="1" fill="#FAF7F2" />
        <path d="M 0 0 L 11 8 L 22 0" stroke="#2C2C2C" strokeWidth="1" fill="none" />
      </g>

      {/* Tiny drifting seeds */}
      <path d="M 150 90 Q 158 82 165 90 Q 158 96 150 90" fill="none" stroke="#2C2C2C" strokeWidth="0.9" className="animate-float" style={{ animationDelay: "1s" }} />
      <path d="M 360 110 Q 368 102 376 110 Q 368 116 360 110" fill="none" stroke="#2C2C2C" strokeWidth="0.9" className="animate-float" style={{ animationDelay: "0.3s" }} />
    </svg>
  );
}
