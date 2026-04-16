interface TriggerWarningProps {
  keyword: string;
}

export default function TriggerWarning({ keyword }: TriggerWarningProps) {
  return (
    <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
      <span>⚠</span>
      <span>Content note: {keyword}</span>
    </div>
  );
}
