import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/useAuth';
import AgentPanel from './components/AgentPanel';
import ChatInput from './components/ChatInput';
import ChatTimeline from './components/ChatTimeline';
import { createMockTimeline } from './mockData';
import type { ConversationEntry, FeedbackRequestEntry, TimelineEntry } from './types';

const INITIAL_TIMELINE = createMockTimeline();

export default function SpaceCaptainChat() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEntry[]>(INITIAL_TIMELINE);
  const { settings } = useSettings();
  const { user } = useAuth();
  const captainName = user?.name?.toUpperCase() ?? 'CAPTAIN';

  const handleSendMessage = (message: string) => {
    const captainMsg: ConversationEntry = {
      id: `msg_${Date.now()}`,
      type: 'conversation',
      role: 'captain',
      content: message,
      timestamp: new Date(),
    };
    setTimeline((prev) => [...prev, captainMsg]);

    // Mock agent response
    setTimeout(() => {
      const agentMsg: ConversationEntry = {
        id: `msg_${Date.now()}`,
        type: 'conversation',
        role: 'agent',
        content:
          "Acknowledged, Captain. I'm processing your request through my neural networks.\n\n*This is a demo interface with simulated timeline data. Full AI capabilities are under development.*\n\nIn the production system, I will:\n- Fetch real task data via tool calls\n- Update your productivity memories\n- Provide personalized insights based on your patterns\n- Take proactive actions to help you succeed\n\nStanding by for full deployment. 🚀",
        timestamp: new Date(),
        toolCalls: [{ name: 'getUserMemory', status: 'running' }],
      };
      setTimeline((prev) => [...prev, agentMsg]);
    }, 800);
  };

  const handleFeedbackResponse = (feedbackId: string, value: string) => {
    setTimeline((prev) =>
      prev.map((entry) =>
        entry.id === feedbackId && entry.type === 'feedback_request'
          ? { ...entry, responded: { value, respondedAt: new Date() } }
          : entry
      )
    );

    // AI acknowledgment
    setTimeout(() => {
      const acknowledgment: ConversationEntry = {
        id: `ack_${Date.now()}`,
        type: 'conversation',
        role: 'agent',
        content: `Thanks for the feedback, Captain! I've updated your ${
          (timeline.find((e) => e.id === feedbackId) as FeedbackRequestEntry)?.questionType.replace(
            '_',
            ' '
          )
        } profile. This helps me serve you better. 📊`,
        timestamp: new Date(),
      };
      setTimeline((prev) => [...prev, acknowledgment]);
    }, 600);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="absolute bottom-6 right-6 group flex items-center gap-2 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-slate-900/90
          backdrop-blur-xl border border-indigo-400/40 rounded-2xl px-4 py-3
          shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
          hover:border-indigo-400/70 transition-all duration-300 z-50"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-400/50
          group-hover:scale-110 transition-transform flex-shrink-0">
          <img src={settings.agentImage} alt={settings.agentName} className="w-full h-full object-cover" />
        </div>
        <div className="text-left">
          <div className="text-white text-sm font-bold">{settings.agentName}</div>
          <div className="text-indigo-300/80 text-xs">AI Assistant</div>
        </div>
        <div className="ml-2 text-indigo-300/60 text-xs group-hover:text-indigo-300/90 transition-colors">
          Click to open ›
        </div>
      </button>
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn"
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
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
              <div>
                <div className="text-white font-mono text-base font-bold tracking-wider flex items-center gap-2">
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
                flex items-center justify-center text-sm font-bold shadow-lg"
            >
              ✕
            </button>
          </div>

          {/* Timeline */}
          <ChatTimeline
            timeline={timeline}
            agentName={settings.agentName}
            agentImage={settings.agentImage}
            captainName={captainName}
            onFeedbackRespond={handleFeedbackResponse}
          />

          {/* Input area */}
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>,
    document.body
  );
}
