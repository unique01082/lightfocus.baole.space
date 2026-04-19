import type { FeedbackRequestEntry } from '../types';

interface FeedbackEntryProps {
  entry: FeedbackRequestEntry;
  onRespond: (feedbackId: string, value: string) => void;
}

export default function FeedbackEntry({ entry, onRespond }: FeedbackEntryProps) {
  const isResponded = !!entry.responded;

  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-cyan-600 to-teal-700 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/40">
        📊
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-1.5">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          FEEDBACK REQUEST
        </div>
        <div className="px-5 py-3.5 rounded-2xl text-base leading-relaxed font-sans border-2 bg-cyan-950/60 border-cyan-500/40 text-cyan-50 rounded-tl-sm shadow-lg">
          <div className="mb-3">{entry.question}</div>
          {isResponded ? (
            <div className="flex items-center gap-2 text-sm text-cyan-300">
              <span>✓ Responded:</span>
              <span className="font-semibold">
                {entry.options.find((opt) => opt.value === entry.responded?.value)?.emoji}{' '}
                {entry.options.find((opt) => opt.value === entry.responded?.value)?.label}
              </span>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {entry.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onRespond(entry.id, option.value)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="text-[10px] font-mono text-slate-500 mt-1">
          {entry.timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </div>
      </div>
    </div>
  );
}
