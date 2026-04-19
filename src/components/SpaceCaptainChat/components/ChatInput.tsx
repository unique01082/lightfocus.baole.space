import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
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
    <div className="border-t-2 border-indigo-500/30 p-5 bg-black/40 backdrop-blur-sm relative z-10">
      <div className="flex gap-3 items-end">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="TRANSMIT MESSAGE TO AI AGENT..."
          className="flex-1 bg-slate-900/70 border-2 border-indigo-500/40 rounded-xl px-4 py-3 text-indigo-100 placeholder-indigo-500/50 resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/60 transition-all min-h-[80px] max-h-[160px]"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-mono font-bold tracking-widest rounded-xl border-2 border-indigo-400/50 disabled:border-slate-600/30 shadow-lg shadow-indigo-500/30 disabled:shadow-none transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          ⚡ TRANSMIT
        </button>
      </div>
      <div className="text-indigo-500/40 font-mono text-[10px] mt-1.5 text-center">
        🌟 UNIFIED ACTIVITY TIMELINE • Conversations + Activities + System Events + Feedback
      </div>
    </div>
  );
}
