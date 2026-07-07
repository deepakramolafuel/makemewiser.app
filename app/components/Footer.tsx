import Link from "next/link";
import FuelLogo from "./FuelLogo";
import SubscribeCTA from "./SubscribeCTA";

export default function Footer() {
  return (
    <footer className="mt-auto w-full pt-10 pb-6 flex flex-col items-center gap-6 text-center text-sm text-secondary">
      {/* Newsletter subscribe — gentle nudge toward the Substack */}
      <SubscribeCTA />

      {/* Hairline divider */}
      <div className="w-16 border-t border-card-border" />

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
