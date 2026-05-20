// Recreation of the Project FUEL wordmark — bold stacked PROJECT / FUEL
// with the trademark icon and speech-bubble tail.

export default function FuelLogo({ className = "", width = 96 }: { className?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 240 160"
      width={width}
      fill="currentColor"
      stroke="currentColor"
      className={className}
      aria-label="Project FUEL"
    >
      {/* Top horizontal rule */}
      <rect x="0" y="6" width="240" height="4" />

      {/* PROJECT */}
      <text
        x="120"
        y="55"
        textAnchor="middle"
        fontSize="34"
        fontWeight="900"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        letterSpacing="1"
        stroke="none"
      >
        PROJECT
      </text>

      {/* Middle horizontal rule */}
      <rect x="0" y="74" width="240" height="4" />

      {/* FUEL */}
      <text
        x="10"
        y="118"
        fontSize="34"
        fontWeight="900"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        letterSpacing="1"
        stroke="none"
      >
        FUEL
      </text>

      {/* Trademark icon — 2x2 grid of shapes next to FUEL */}
      <g transform="translate(154, 92)" stroke="none">
        {/* top-left: quarter circle */}
        <path d="M 14 0 A 14 14 0 0 0 0 14 L 14 14 Z" />
        {/* top-right: filled square (the brand brown dot) */}
        <circle cx="29" cy="7" r="4" fill="#5C3A20" />
        {/* bottom-left: filled square */}
        <rect x="0" y="16" width="14" height="11" />
        {/* bottom-right: bookmark shape */}
        <path d="M 19 16 L 33 16 L 33 28 L 29 25 L 26 28 L 19 28 Z" />
      </g>

      {/* Bottom rule with speech-bubble tail */}
      <path
        d="M 0 138 L 162 138 L 178 156 L 196 138 L 240 138"
        fill="none"
        strokeWidth="4"
      />
    </svg>
  );
}
