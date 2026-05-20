import Link from "next/link";
import FuelLogo from "./FuelLogo";

export default function Footer() {
  return (
    <footer className="mt-auto pt-10 pb-6 flex flex-col items-center gap-3 text-center text-sm text-secondary">
      <Link
        href="https://www.projectfuel.in"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:opacity-80 transition-opacity"
        aria-label="Project FUEL"
      >
        <FuelLogo width={70} />
      </Link>
      <div className="flex items-center gap-2 text-xs">
        <Link
          href="/about"
          className="hover:text-primary transition-colors underline underline-offset-2"
        >
          About
        </Link>
        <span>·</span>
        <span>wiser.projectfuel.in</span>
      </div>
    </footer>
  );
}
