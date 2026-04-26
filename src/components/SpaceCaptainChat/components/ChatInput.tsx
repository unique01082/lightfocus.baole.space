import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  status?: string;
  onStop?: () => void;
}

export default function ChatInput({ onSendMessage, isLoading = false, status, onStop }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const isStreaming = status === 'streaming' || status === 'submitted';

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 border-t-2 border-indigo-500/30 p-5 bg-black/40 backdrop-blur-sm relative z-10">
      {/* Streaming indicator */}
      {isStreaming && (
        <div className="flex items-center gap-2 mb-2 text-indigo-300/70 font-mono text-xs">
          <span className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
          {status === 'submitted' ? 'Agent is thinking...' : 'Agent is responding...'}
        </div>
      )}
      <div className="flex gap-3 items-end">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={isLoading ? 'Agent is busy...' : 'TRANSMIT MESSAGE TO AI AGENT...'}
          className="flex-1 bg-slate-900/70 border-2 border-indigo-500/40 rounded-xl px-4 py-3 text-indigo-100 placeholder-indigo-500/50 resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/60 transition-all min-h-[80px] max-h-[160px] overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isStreaming && onStop ? (
          <button
            onClick={onStop}
            className="px-6 py-3 bg-gradient-to-r from-red-700 to-rose-800 hover:from-red-600 hover:to-rose-700 text-white font-mono font-bold tracking-widest rounded-xl border-2 border-red-500/50 shadow-lg shadow-red-500/20 transition-all duration-200 hover:scale-105"
          >
            ■ STOP
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-mono font-bold tracking-widest rounded-xl border-2 border-indigo-400/50 disabled:border-slate-600/30 shadow-lg shadow-indigo-500/30 disabled:shadow-none transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            ⚡ TRANSMIT
          </button>
        )}
      </div>
      <div className="text-indigo-500/40 font-mono text-[10px] mt-1.5 text-center">
        🌟 UNIFIED ACTIVITY TIMELINE • Conversations + Activities + System Events + Feedback
      </div>
    </div>
  );
}

