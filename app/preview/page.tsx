// Side-by-side preview of the two hero illustration variants.
// Visit /preview to compare and pick one.

import Link from "next/link";
import HeroIllustration from "../components/illustrations/HeroIllustration";
import HeroIllustrationCrane from "../components/illustrations/HeroIllustrationCrane";

export const metadata = {
  title: "Hero preview — Make Me Wiser",
};

export default function HeroPreviewPage() {
  return (
    <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full px-5 py-10">
      <Link href="/" className="text-sm text-secondary hover:text-primary transition-colors mb-8 inline-block">
        ← Make Me Wiser
      </Link>

      <h1 className="font-serif text-3xl text-primary mb-2">Hero illustration preview</h1>
      <p className="text-sm text-secondary mb-10 max-w-2xl">
        Two variants of the homepage illustration. Click each &ldquo;Preview live&rdquo;
        link to see it in the real homepage. Tell Jay which one to keep and
        we&rsquo;ll bake it in.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Variant 1 — The Journey */}
        <section className="border border-card-border p-6 bg-cream">
          <header className="mb-4">
            <p className="text-xs tracking-widest text-secondary uppercase">Variant 1</p>
            <h2 className="font-serif text-2xl text-primary mt-1">The Journey</h2>
            <p className="text-xs text-secondary mt-1 italic">
              A letter travels from a globe to someone reading.
            </p>
          </header>
          <div className="mb-4">
            <HeroIllustration />
          </div>
          <Link
            href="/?hero=1"
            className="inline-block text-sm text-primary border-b border-primary hover:opacity-70 transition-opacity"
          >
            Preview live →
          </Link>
        </section>

        {/* Variant 2 — The Crane */}
        <section className="border border-card-border p-6 bg-cream">
          <header className="mb-4">
            <p className="text-xs tracking-widest text-secondary uppercase">Variant 2</p>
            <h2 className="font-serif text-2xl text-primary mt-1">The Crane</h2>
            <p className="text-xs text-secondary mt-1 italic">
              A paper crane carrying lessons across the sky.
            </p>
          </header>
          <div className="mb-4">
            <HeroIllustrationCrane />
          </div>
          <Link
            href="/?hero=2"
            className="inline-block text-sm text-primary border-b border-primary hover:opacity-70 transition-opacity"
          >
            Preview live →
          </Link>
        </section>
      </div>

      <p className="text-xs text-secondary mt-10 max-w-2xl">
        Default on the homepage is set via the <code className="bg-card-border/30 px-1">NEXT_PUBLIC_HERO_VARIANT</code>{" "}
        environment variable. Visitors can also override with{" "}
        <code className="bg-card-border/30 px-1">?hero=1</code> or{" "}
        <code className="bg-card-border/30 px-1">?hero=2</code> on the home page.
      </p>
    </div>
  );
}
