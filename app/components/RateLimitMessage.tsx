import SeedlingIllustration from "./illustrations/SeedlingIllustration";

interface RateLimitMessageProps {
  onDone: () => void;
}

export default function RateLimitMessage({ onDone }: RateLimitMessageProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center py-4">
      <SeedlingIllustration />

      <div className="space-y-3 max-w-xs">
        <p className="font-serif text-xl text-primary leading-relaxed">
          You&rsquo;ve received 10 life lessons today.
        </p>
        <p className="text-sm text-secondary leading-relaxed">
          Sit with them. Let them find you before you look for more.
        </p>
      </div>

      <button
        onClick={onDone}
        className="mt-2 px-8 py-3.5 border border-primary text-primary text-sm tracking-wide hover:bg-primary hover:text-cream transition-colors"
      >
        Share your own lesson instead
      </button>
    </div>
  );
}
