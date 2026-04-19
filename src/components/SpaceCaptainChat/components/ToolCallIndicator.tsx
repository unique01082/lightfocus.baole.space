import type { ToolCall } from '../types';

interface ToolCallIndicatorProps {
  toolCalls: ToolCall[];
}

export default function ToolCallIndicator({ toolCalls }: ToolCallIndicatorProps) {
  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap mb-1">
      {toolCalls.map((tool, idx) => (
        <div
          key={idx}
          className="flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-500/30 rounded-lg px-2 py-1"
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              tool.status === 'running' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
            }`}
          />
          <span className="text-[10px] font-mono text-indigo-300">🔧 {tool.name}</span>
        </div>
      ))}
    </div>
  );
}
