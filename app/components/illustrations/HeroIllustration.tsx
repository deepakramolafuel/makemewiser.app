// Hand-drawn style envelope illustration for the homepage
// Inspired by @janustiu's Life Advice from Strangers — envelopes flowing between portals

export default function HeroIllustration() {
  return (
    <svg
      viewBox="30 110 460 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto"
      aria-hidden="true"
      overflow="hidden"
    >
      {/* Left portal/mailbox shape */}
      <ellipse cx="100" cy="200" rx="45" ry="65" fill="#2C2C2C" className="animate-pulse-slow" />

      {/* Flowing path connecting portals */}
      <path
        d="M 145 200 C 200 140, 250 280, 300 200 C 330 160, 370 220, 400 180"
        stroke="#2C2C2C"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="animate-draw-path"
      />

      {/* Right portal/mailbox shape */}
      <ellipse cx="420" cy="200" rx="40" ry="58" fill="#2C2C2C" className="animate-pulse-slow" style={{ animationDelay: "1s" }} />

      {/* Envelope 1 - flying top */}
      <g transform="translate(200, 140) rotate(-12)" className="animate-float" style={{ animationDelay: "0.2s" }}>
        <rect x="0" y="0" width="40" height="28" rx="2" stroke="#2C2C2C" strokeWidth="1.5" fill="#FAF7F2" />
        <path d="M 0 0 L 20 14 L 40 0" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />
        <path d="M 0 28 L 15 14" stroke="#2C2C2C" strokeWidth="1" fill="none" />
        <path d="M 40 28 L 25 14" stroke="#2C2C2C" strokeWidth="1" fill="none" />
      </g>

      {/* Envelope 2 - middle */}
      <g transform="translate(270, 180) rotate(8)" className="animate-float" style={{ animationDelay: "0.5s" }}>
        <rect x="0" y="0" width="48" height="34" rx="2" stroke="#2C2C2C" strokeWidth="1.5" fill="#FAF7F2" />
        <path d="M 0 0 L 24 17 L 48 0" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />
        <path d="M 0 34 L 18 17" stroke="#2C2C2C" strokeWidth="1" fill="none" />
        <path d="M 48 34 L 30 17" stroke="#2C2C2C" strokeWidth="1" fill="none" />
      </g>

      {/* Envelope 3 - near right portal */}
      <g transform="translate(350, 160) rotate(-5)" className="animate-float" style={{ animationDelay: "0.8s" }}>
        <rect x="0" y="0" width="36" height="24" rx="2" stroke="#2C2C2C" strokeWidth="1.5" fill="#FAF7F2" />
        <path d="M 0 0 L 18 12 L 36 0" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />
      </g>

      {/* Envelope 4 - exiting right portal */}
      <g transform="translate(400, 240) rotate(15)" className="animate-float" style={{ animationDelay: "1.1s" }}>
        <rect x="0" y="0" width="42" height="30" rx="2" stroke="#2C2C2C" strokeWidth="1.5" fill="#FAF7F2" />
        <path d="M 0 0 L 21 15 L 42 0" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />
        <path d="M 0 30 L 16 15" stroke="#2C2C2C" strokeWidth="1" fill="none" />
        <path d="M 42 30 L 26 15" stroke="#2C2C2C" strokeWidth="1" fill="none" />
      </g>

      {/* Small letter peeking from left portal */}
      <g transform="translate(120, 170) rotate(-20)">
        <rect x="0" y="0" width="22" height="30" rx="1" stroke="#2C2C2C" strokeWidth="1" fill="#FAF7F2" />
        <line x1="4" y1="8" x2="18" y2="8" stroke="#E5E0D8" strokeWidth="1" />
        <line x1="4" y1="13" x2="18" y2="13" stroke="#E5E0D8" strokeWidth="1" />
        <line x1="4" y1="18" x2="14" y2="18" stroke="#E5E0D8" strokeWidth="1" />
      </g>

      {/* Decorative stars */}
      <g className="animate-twinkle">
        <path d="M 170 120 L 172 126 L 178 128 L 172 130 L 170 136 L 168 130 L 162 128 L 168 126 Z" fill="none" stroke="#2C2C2C" strokeWidth="1" />
      </g>
      <g className="animate-twinkle" style={{ animationDelay: "0.7s" }}>
        <path d="M 340 130 L 341.5 134 L 346 135.5 L 341.5 137 L 340 141 L 338.5 137 L 334 135.5 L 338.5 134 Z" fill="none" stroke="#2C2C2C" strokeWidth="1" />
      </g>
      <g className="animate-twinkle" style={{ animationDelay: "1.4s" }}>
        <path d="M 150 280 L 152 286 L 158 288 L 152 290 L 150 296 L 148 290 L 142 288 L 148 286 Z" fill="none" stroke="#2C2C2C" strokeWidth="1" />
      </g>

      {/* Small decorative diamond */}
      <rect x="228" y="230" width="6" height="6" transform="rotate(45 231 233)" fill="#2C2C2C" />

      {/* Small floating seeds/leaves */}
      <path d="M 310 260 Q 315 250 320 260 Q 315 265 310 260" fill="none" stroke="#2C2C2C" strokeWidth="1" />
      <path d="M 180 250 Q 185 242 190 250 Q 185 255 180 250" fill="none" stroke="#2C2C2C" strokeWidth="1" transform="rotate(30 185 248)" />
    </svg>
  );
}
