// Project FUEL wordmark — uses the official logo image from /public.
// Place the logo file at /public/fuel-logo.png (or .svg).

import Image from "next/image";

// Native aspect of the supplied logo: 842×595 (1.415 : 1)
const NATIVE_W = 842;
const NATIVE_H = 595;

export default function FuelLogo({
  className = "",
  width = 70,
}: {
  className?: string;
  width?: number;
}) {
  const height = Math.round((NATIVE_H / NATIVE_W) * width);

  return (
    <Image
      src="/fuel-logo.png"
      alt="Project FUEL"
      width={width}
      height={height}
      priority
      className={className}
      style={{ height: "auto", width }}
    />
  );
}
