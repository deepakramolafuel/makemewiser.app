import Link from "next/link";
import Footer from "../components/Footer";

export const metadata = {
  title: "About — Make Me Wiser",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 max-w-xl mx-auto w-full px-5 py-10">
      <Link
        href="/"
        className="text-sm text-secondary hover:text-primary transition-colors mb-8 inline-block"
      >
        ← Make Me Wiser
      </Link>

      <article className="flex-1 space-y-6 text-primary leading-relaxed">
        <h1 className="font-serif text-3xl">About Project FUEL</h1>

        <p>
          For over a decade, we&rsquo;ve been collecting life lessons from people
          everywhere — fishermen, midwives, refugees, grandmothers, strangers in
          line at the post office.
        </p>

        <p>
          The idea is simple. Everyone is carrying something they&rsquo;ve learned.
          And someone, somewhere, needs to hear it today.
        </p>

        <p>
          Make Me Wiser is where those lessons live. Two buttons. One arrives for
          you. One travels onward from you.
        </p>

        <div className="border-t border-card-border pt-6 space-y-2 text-sm">
          <p>
            Learn more at{" "}
            <a
              href="https://projectfuel.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-secondary transition-colors"
            >
              projectfuel.in
            </a>
          </p>
          <p>
            Follow along on Instagram —{" "}
            <a
              href="https://instagram.com/projectfuelorg"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-secondary transition-colors"
            >
              @projectfuelorg
            </a>
          </p>
        </div>
      </article>

      <Footer />
    </div>
  );
}
