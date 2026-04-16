// Small seedling/plant illustration — used for confirmation and rate limit screens

export default function SeedlingIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-24 mx-auto ${className}`}
      aria-hidden="true"
    >
      {/* Ground line */}
      <path d="M 20 120 Q 60 125 100 120" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />

      {/* Stem */}
      <path d="M 60 120 C 60 100 58 85 60 60" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />

      {/* Left leaf */}
      <path d="M 60 90 Q 35 75 30 55 Q 50 65 60 90" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />
      <path d="M 45 72 L 55 85" stroke="#2C2C2C" strokeWidth="0.8" fill="none" />

      {/* Right leaf */}
      <path d="M 60 75 Q 85 60 90 40 Q 70 50 60 75" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />
      <path d="M 75 57 L 63 70" stroke="#2C2C2C" strokeWidth="0.8" fill="none" />

      {/* Top bud */}
      <path d="M 60 60 Q 50 40 55 25 Q 60 35 65 25 Q 70 40 60 60" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />

      {/* Small star */}
      <path d="M 85 30 L 86 33 L 89 34 L 86 35 L 85 38 L 84 35 L 81 34 L 84 33 Z" fill="none" stroke="#2C2C2C" strokeWidth="0.8" />
    </svg>
  );
}
