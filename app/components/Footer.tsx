import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto pt-8 pb-6 text-center text-sm text-secondary">
      <Link
        href="/about"
        className="hover:text-primary transition-colors underline underline-offset-2"
      >
        About Project FUEL
      </Link>
      <span className="mx-2">·</span>
      <span>wiser.projectfuel.in</span>
    </footer>
  );
}
