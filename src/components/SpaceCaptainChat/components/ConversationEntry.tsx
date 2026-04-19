import MarkdownRenderer from '../../MarkdownRenderer';
import type { ConversationEntry as ConversationEntryType } from '../types';
import ToolCallIndicator from './ToolCallIndicator';

interface ConversationEntryProps {
  entry: ConversationEntryType;
  agentName: string;
  agentImage: string;
  captainName: string;
}

export default function ConversationEntry({
  entry,
  agentName,
  agentImage,
  captainName,
}: ConversationEntryProps) {
  return (
    <div className={`flex gap-4 ${entry.role === 'captain' ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-lg font-bold border-2
        ${
          entry.role === 'agent'
            ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-indigo-400/50 text-white shadow-lg shadow-indigo-500/40'
            : 'bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 border-amber-400/50 text-white shadow-lg shadow-amber-500/40'
        }`}
      >
        {entry.role === 'agent' ? (
          <img src={agentImage} alt={agentName} className="w-full h-full object-cover rounded-full" />
        ) : (
          '👨‍🚀'
        )}
      </div>

      <div
        className={`max-w-[70%] ${entry.role === 'captain' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}
      >
        <div
          className={`flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest
          ${entry.role === 'agent' ? 'text-indigo-400' : 'text-amber-400'}`}
        >
          {entry.role === 'agent' ? (
            <>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {agentName} • AI ASSISTANT
            </>
          ) : (
            <>
              CAPTAIN {captainName} • COMMANDING OFFICER
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </>
          )}
        </div>
        {entry.toolCalls && <ToolCallIndicator toolCalls={entry.toolCalls} />}
        <div
          className={`px-5 py-3.5 rounded-2xl text-base leading-relaxed font-sans border-2
            ${
              entry.role === 'agent'
                ? 'bg-indigo-900/70 border-indigo-500/40 text-indigo-50 rounded-tl-sm shadow-lg shadow-indigo-900/30'
                : 'bg-gradient-to-br from-amber-900/80 to-orange-900/70 border-amber-500/40 text-amber-50 rounded-tr-sm shadow-lg shadow-amber-900/30'
            }`}
        >
          {entry.role === 'agent' ? <MarkdownRenderer content={entry.content} /> : entry.content}
        </div>
        <div className="text-[10px] font-mono text-slate-500">
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
