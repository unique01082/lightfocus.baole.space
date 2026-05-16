import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/useAuth';
import AgentPanel from './components/AgentPanel';
import ChatInput from './components/ChatInput';
import ChatTimeline from './components/ChatTimeline';
import { useSpaceCaptainChat } from './hooks/useSpaceCaptainChat';
import { useTimeline } from './hooks/useTimeline';
import type { TimelineEntry } from './types';

export default function SpaceCaptainChat() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { settings } = useSettings();
  const { user } = useAuth();
  const captainName = user?.name?.toUpperCase() ?? 'CAPTAIN';

  const {
    conversationEntries,
    isLoading,
    status,
    sendMessage,
    stop,
    error,
    unreadChatCount,
    markChatRead,
  } = useSpaceCaptainChat();

  const { nonChatEntries, respondToFeedback, unreadTimelineCount, markTimelineSeen } = useTimeline();

  const totalUnread = unreadChatCount + unreadTimelineCount;

  const handleExpand = () => {
    setIsExpanded(true);
    markChatRead();
    markTimelineSeen();
  };

  // Merge conversation + timeline entries, sorted by timestamp
  const timeline = useMemo<TimelineEntry[]>(() => {
    return [...conversationEntries, ...nonChatEntries].sort(
      (a, b) => +a.timestamp - +b.timestamp,
    );
  }, [conversationEntries, nonChatEntries]);

  const handleFeedbackResponse = (feedbackId: string, value: string) => {
    respondToFeedback(feedbackId, value);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={handleExpand}
        className="absolute bottom-6 right-6 group z-50"
        style={{ filter: totalUnread > 0
          ? 'drop-shadow(0 0 14px rgba(245,158,11,0.55))'
          : 'drop-shadow(0 0 12px rgba(99,102,241,0.5))' }}
      >
        {/* Corner brackets */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 rounded-tl pointer-events-none" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 rounded-tr pointer-events-none" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80 rounded-bl pointer-events-none" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80 rounded-br pointer-events-none" />

        {/* Scanline overlay */}
        <span className="absolute inset-0 rounded-xl pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)' }} />

        <div className="flex items-center gap-3 bg-gradient-to-br from-slate-950/95 via-indigo-950/90 to-slate-950/95
          backdrop-blur-xl border border-indigo-500/40 group-hover:border-cyan-400/70
          rounded-xl px-3 py-2.5 transition-all duration-300
          shadow-[0_0_20px_rgba(99,102,241,0.25)] group-hover:shadow-[0_0_28px_rgba(34,211,238,0.4)]">

          {/* Avatar with pulsing ring */}
          <div className="relative w-9 h-9 flex-shrink-0">
            <span className={`absolute inset-0 rounded-full border animate-ping opacity-30 ${
              totalUnread > 0 ? 'border-amber-400/70' : 'border-cyan-400/40'
            }`} />
            <div className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-colors ${
              totalUnread > 0
                ? 'border-amber-400/70 group-hover:border-amber-300'
                : 'border-indigo-400/60 group-hover:border-cyan-400/80'
            }`}>
              <img src={settings.agentImage} alt={settings.agentName} className="w-full h-full object-cover" />
            </div>
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full bg-red-500
                text-[9px] font-bold text-white flex items-center justify-center px-0.5
                border border-red-400/60 shadow-[0_0_6px_rgba(239,68,68,0.6)] leading-none">
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </div>

          {/* Text block */}
          <div className="text-left min-w-0">
            <div className="text-white text-sm font-bold font-mono leading-tight tracking-wide truncate">
              {settings.agentName}
            </div>
            <div className="text-[10px] font-mono font-bold tracking-widest uppercase leading-none mt-0.5">
              {totalUnread > 0
                ? <span className="text-amber-400 animate-pulse">{totalUnread} NEW MSG{totalUnread > 1 ? 'S' : ''}</span>
                : <span className="text-cyan-400/80">● ONLINE</span>}
            </div>
          </div>

          {/* CTA arrow */}
          <div className="ml-1 text-cyan-300/50 group-hover:text-cyan-300 transition-colors font-mono text-base leading-none">
            ▶
          </div>
        </div>
      </button>
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0" onClick={() => setIsExpanded(false)} />

      {/* Chat panel */}
      <div
        className="relative m-auto w-full max-w-[80vw] h-[80vh] flex rounded-3xl overflow-hidden
          border-2 border-indigo-400/40 shadow-2xl shadow-indigo-500/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Agent panel */}
        <AgentPanel
          agentName={settings.agentName}
          agentImage={settings.agentImage}
          timeline={timeline}
        />

        {/* Right: Chat area */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 via-indigo-950/50 to-slate-950 relative">
          {/* Starfield background */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent), radial-gradient(1px 1px at 33% 80%, white, transparent)',
              backgroundSize: '200px 200px',
              backgroundPosition:
                '0 0, 40px 60px, 130px 270px, 70px 100px, 150px 30px, 90px 180px',
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-indigo-500/30 bg-black/40 backdrop-blur-sm relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse [animation-delay:0.4s]" />
              </div>
              <div className="text-white font-mono text-xs font-bold tracking-wider">
                <div className="text-white font-mono text-sm font-bold tracking-wider flex items-center gap-2">
                  <span className="text-indigo-400">⟨⟨</span>
                  UNIFIED ACTIVITY TIMELINE
                  <span className="text-indigo-400">⟩⟩</span>
                </div>
                <div className="text-indigo-400/60 font-mono text-xs">
                  CONVERSATIONS • ACTIVITIES • EVENTS • FEEDBACK
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-9 h-9 rounded-full bg-slate-800/90 hover:bg-red-900/70 border-2 border-slate-600/60
                hover:border-red-500/60 text-slate-300 hover:text-red-300 transition-all duration-200
                flex items-center justify-center text-md font-bold shadow-lg"
            >
              ✕
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-900/40 border-b border-red-500/30 px-6 py-2 text-red-300 text-xs font-mono relative z-10">
              ⚠ Connection error: {error.message}
            </div>
          )}

          {/* Timeline */}
          <ChatTimeline
            timeline={timeline}
            agentName={settings.agentName}
            agentImage={settings.agentImage}
            captainName={captainName}
            onFeedbackRespond={handleFeedbackResponse}
          />

          {/* Input area */}
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            status={status}
            onStop={stop}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

