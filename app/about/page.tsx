import Link from "next/link";
import Footer from "../components/Footer";

export const metadata = {
  title: "About — Make Me Wiser",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 max-w-xl mx-auto w-full px-5 py-10">
      <Link href="/" className="text-sm text-secondary hover:text-primary transition-colors mb-8 inline-block">
        ← Make Me Wiser
      </Link>

      <article className="flex-1 space-y-6 text-primary leading-relaxed">
        <h1 className="font-serif text-3xl">About Project FUEL</h1>

        <p className="text-secondary text-sm">
          This is not a corporate about page. It is a letter.
        </p>

        <p>
          In 2009, Deepak Ramola started asking people a simple question:{" "}
          <em>What did life teach you?</em> He asked fishermen in Kerala, midwives in
          Kenya, refugees in Hungary, street vendors in Brazil, grandmothers in
          Japan. People that traditional education — and most technology — overlooks.
        </p>

        <p>
          He called the project <strong>FUEL</strong> — Forward the Understanding of
          Every Life Lesson. The name is a promise: every lesson collected is meant to
          travel forward, to find someone who needs it.
        </p>

        <p>
          Over fifteen years, FUEL has documented wisdom from people across 195
          countries. The work has reached more than 20 million people across five
          continents. It has been recognized among the world&rsquo;s top 100 education
          innovations by HundrED in Finland. It generates a 1:12 social return on
          investment — meaning every rupee or dollar spent sends twelve times that
          value back into the world.
        </p>

        <p>
          Make Me Wiser is where this living library lives now. Not behind a paywall.
          Not locked in a database. In your pocket, when you need it.
        </p>

        <p>
          The design is deliberately simple. Two actions. No browsing, no filters, no
          algorithm. The lesson that arrives is the one meant for you today.
        </p>

        <p>
          Every lesson you receive carries a real person&rsquo;s name, age, and country.
          It ends with a tilde (~) — Deepak&rsquo;s mark — because wisdom is never
          finished. It is still continuing somewhere.
        </p>

        <div className="border-t border-card-border pt-6 space-y-2">
          <p>
            To learn more about Project FUEL, visit{" "}
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
            Follow on Instagram:{" "}
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

        <p className="text-secondary pt-4">Warmly,</p>
        <p className="font-serif text-lg">Project FUEL</p>
      </article>

      <Footer />
    </div>
  );
}
