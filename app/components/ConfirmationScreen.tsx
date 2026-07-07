import SeedlingIllustration from "./illustrations/SeedlingIllustration";

interface ConfirmationScreenProps {
  onMakeWiser: () => void;
  onShareAnother: () => void;
}

export default function ConfirmationScreen({
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
