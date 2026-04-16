import SeedlingIllustration from "./illustrations/SeedlingIllustration";

interface ConfirmationScreenProps {
  totalContributors: number;
  onMakeWiser: () => void;
  onShareAnother: () => void;
}

export default function ConfirmationScreen({
  totalContributors,
  onMakeWiser,
  onShareAnother,
}: ConfirmationScreenProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center py-8 max-w-sm animate-fade-in-up">
      <SeedlingIllustration />

      <div className="space-y-3">
        <p className="font-serif text-2xl text-primary leading-relaxed">
          Your wisdom is now in the world.
        </p>
        <p className="text-sm text-secondary leading-relaxed">
          Someone, somewhere, will carry it forward.
        </p>
        <p className="text-xs text-secondary mt-4 border-t border-card-border pt-4">
          You are the{" "}
          <span className="font-medium text-primary">
            {totalContributors.toLocaleString()}
            {ordinalSuffix(totalContributors)}
          </span>{" "}
          person to pass on a life lesson through FUEL.
        </p>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={onMakeWiser}
          className="px-8 py-3.5 bg-button-fill text-cream text-sm tracking-wide hover:opacity-90 transition-opacity"
        >
          Make me wiser
        </button>
        <button
          onClick={onShareAnother}
          className="px-6 py-3.5 border border-primary text-primary text-sm tracking-wide hover:bg-primary hover:text-cream transition-colors"
        >
          Share another
        </button>
      </div>
    </div>
  );
}

function ordinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] ?? s[v] ?? s[0];
}
