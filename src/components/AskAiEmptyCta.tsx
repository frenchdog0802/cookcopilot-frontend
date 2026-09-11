import { BotMessageSquare } from 'lucide-react';

interface AskAiEmptyCtaProps {
  hint: string;
  label: string;
  onClick: () => void;
}

/** Empty-state CTA that steers users toward the AI chat instead of manual CRUD. */
export function AskAiEmptyCta({ hint, label, onClick }: AskAiEmptyCtaProps) {
  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <p className="text-sm text-muted">{hint}</p>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-lg bg-sage/50 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-sage/70"
      >
        <BotMessageSquare size={16} className="text-herb" />
        {label}
      </button>
    </div>
  );
}
