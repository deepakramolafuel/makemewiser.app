// A warm, abstract botanical motif that represents connection to a place
// Not a flag — something organic and gentle

interface CountryMotifProps {
  country: string;
}

export default function CountryMotif({ country }: CountryMotifProps) {
  // Generate a deterministic but varied motif based on country name
  const hash = country.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rotation = (hash % 30) - 15;
  const leafCount = 3 + (hash % 3);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 animate-gentle-rotate"
        aria-hidden="true"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Central circle — like a compass or seed */}
        <circle cx="30" cy="30" r="3" fill="none" stroke="#2C2C2C" strokeWidth="0.8" />
        <circle cx="30" cy="30" r="1" fill="#2C2C2C" />

        {/* Radiating leaves/petals — varies by country */}
        {Array.from({ length: leafCount }).map((_, i) => {
          const angle = (360 / leafCount) * i;
          return (
            <g key={i} transform={`rotate(${angle} 30 30)`}>
              <path
                d="M 30 26 Q 33 18 30 10 Q 27 18 30 26"
                fill="none"
                stroke="#2C2C2C"
                strokeWidth="0.8"
              />
              {/* Small leaf vein */}
              <line x1="30" y1="22" x2="30" y2="14" stroke="#E5E0D8" strokeWidth="0.5" />
            </g>
          );
        })}

        {/* Tiny decorative dots between leaves */}
        {Array.from({ length: leafCount }).map((_, i) => {
          const angle = ((360 / leafCount) * i + 360 / leafCount / 2) * (Math.PI / 180);
          const cx = 30 + Math.sin(angle) * 8;
          const cy = 30 - Math.cos(angle) * 8;
          return <circle key={`d${i}`} cx={cx} cy={cy} r="0.8" fill="#8A8478" />;
        })}
      </svg>

      <span className="text-[10px] text-secondary tracking-widest uppercase">
        {country}
      </span>
    </div>
  );
}
