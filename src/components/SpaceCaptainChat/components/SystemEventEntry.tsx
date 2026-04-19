import MarkdownRenderer from '../../MarkdownRenderer';
import type { SystemEventEntry as SystemEventEntryType } from '../types';

interface SystemEventEntryProps {
  entry: SystemEventEntryType;
}

const severityStyles = {
  info: 'bg-blue-950/60 border-blue-500/40 text-blue-50',
  warning: 'bg-amber-950/60 border-amber-500/40 text-amber-50',
  critical: 'bg-red-950/60 border-red-500/40 text-red-50',
  success: 'bg-green-950/60 border-green-500/40 text-green-50',
};

const severityIcons = {
  info: '💡',
  warning: '⚠️',
  critical: '🚨',
  success: '🎉',
};

export default function SystemEventEntry({ entry }: SystemEventEntryProps) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-purple-600 to-pink-700 border-2 border-purple-400/50 shadow-lg shadow-purple-500/40">
        {severityIcons[entry.severity]}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-purple-400 mb-1.5">
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
          SYSTEM EVENT • {entry.eventType.replace(/_/g, ' ').toUpperCase()}
        </div>
        <div
          className={`px-5 py-3.5 rounded-2xl text-base leading-relaxed font-sans border-2 rounded-tl-sm shadow-lg ${severityStyles[entry.severity]}`}
        >
          <MarkdownRenderer content={entry.content} />
          {entry.actions && entry.actions.length > 0 && (
            <div className="flex gap-2 mt-4">
              {entry.actions.map((action, idx) => (
                <button
                  key={idx}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  {action.emoji} {action.label}
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
