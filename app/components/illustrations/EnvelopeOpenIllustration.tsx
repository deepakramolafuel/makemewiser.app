// Open envelope with flowers/leaves emerging — shown after receiving a lesson
// Inspired by the reference app's lesson-reveal illustration

export default function EnvelopeOpenIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-48 mx-auto ${className}`}
      aria-hidden="true"
    >
      {/* Envelope body */}
      <rect x="60" y="150" width="180" height="110" rx="4" stroke="#2C2C2C" strokeWidth="2" fill="#FAF7F2" />

      {/* Envelope flap (open) */}
      <path d="M 60 150 L 150 95 L 240 150" stroke="#2C2C2C" strokeWidth="2" fill="#FAF7F2" />

      {/* Inner flap fold lines */}
      <path d="M 60 260 L 130 200" stroke="#2C2C2C" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M 240 260 L 170 200" stroke="#2C2C2C" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Letter peeking out */}
      <rect x="85" y="120" width="130" height="60" rx="2" stroke="#2C2C2C" strokeWidth="1.5" fill="white" />
      <line x1="100" y1="138" x2="200" y2="138" stroke="#E5E0D8" strokeWidth="1.5" />
      <line x1="100" y1="148" x2="200" y2="148" stroke="#E5E0D8" strokeWidth="1.5" />
      <line x1="100" y1="158" x2="170" y2="158" stroke="#E5E0D8" strokeWidth="1.5" />

      {/* Flower 1 - center, large */}
      <g transform="translate(150, 80)">
        <circle cx="0" cy="0" r="8" fill="none" stroke="#2C2C2C" strokeWidth="1.5" />
        <circle cx="0" cy="-14" r="7" fill="none" stroke="#2C2C2C" strokeWidth="1.5" />
        <circle cx="13" cy="-5" r="7" fill="none" stroke="#2C2C2C" strokeWidth="1.5" />
        <circle cx="8" cy="11" r="7" fill="none" stroke="#2C2C2C" strokeWidth="1.5" />
        <circle cx="-8" cy="11" r="7" fill="none" stroke="#2C2C2C" strokeWidth="1.5" />
        <circle cx="-13" cy="-5" r="7" fill="none" stroke="#2C2C2C" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="4" fill="#2C2C2C" />
      </g>

      {/* Flower 2 - right, small */}
      <g transform="translate(200, 95)">
        <circle cx="0" cy="0" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="0" cy="-9" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="8" cy="-3" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="5" cy="7" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="-5" cy="7" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="-8" cy="-3" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="0" cy="0" r="3" fill="#2C2C2C" />
      </g>

      {/* Flower 3 - left */}
      <g transform="translate(105, 90)">
        <circle cx="0" cy="0" r="6" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="0" cy="-10" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="9" cy="-4" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="6" cy="8" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="-6" cy="8" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="-9" cy="-4" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        <circle cx="0" cy="0" r="3" fill="#2C2C2C" />
      </g>

      {/* Leaves flying off */}
      <path d="M 80 60 Q 70 45 85 42 Q 78 52 80 60" fill="#2C2C2C" transform="rotate(-20 80 50)" />
      <path d="M 220 55 Q 230 40 235 52 Q 225 50 220 55" fill="#2C2C2C" transform="rotate(15 225 48)" />
      <path d="M 245 120 Q 255 110 258 122 Q 248 118 245 120" fill="#2C2C2C" />
      <path d="M 55 115 Q 45 105 50 118 Q 52 112 55 115" fill="#2C2C2C" />

      {/* Small petals floating */}
      <path d="M 170 45 Q 175 35 180 45 Q 175 48 170 45" fill="#2C2C2C" opacity="0.7" />
      <path d="M 120 50 Q 125 40 130 50 Q 125 53 120 50" fill="#2C2C2C" opacity="0.5" transform="rotate(-30 125 46)" />

      {/* Decorative seal/stamp on envelope */}
      <circle cx="220" cy="230" r="12" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />
      <path d="M 215 230 Q 220 225 225 230 Q 220 228 215 230" stroke="#2C2C2C" strokeWidth="1" fill="none" />
    </svg>
  );
}
