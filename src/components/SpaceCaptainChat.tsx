import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/useAuth';
import MarkdownRenderer from './MarkdownRenderer';

interface Message {
  role: 'captain' | 'agent';
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'agent',
    text: "Greetings, Captain. Systems initialized. I am your **AI Navigation and Task Management Assistant**. All ship systems nominal.",
  },
  {
    role: 'captain',
    text: "Give me a breakdown of my most complex task.",
  },
  {
    role: 'agent',
    text: "Analyzing `Deploy Authentication System` mission...\n\n**Complexity:** 4/5 | **Estimated time:** 6 hours\n\n### Subtask Breakdown\n| # | Subtask | Time | Status |\n|---|---------|------|--------|\n| 1 | OAuth provider setup | 1.5h | ⏳ Pending |\n| 2 | User session management | 2h | ⏳ Pending |\n| 3 | Permission middleware | 1.5h | ⏳ Pending |\n| 4 | Testing & security audit | 1h | ⏳ Pending |\n\n> Recommend starting with *OAuth providers* as foundation.",
  },
  {
    role: 'captain',
    text: "What about upcoming deadlines? Any tasks at risk?",
  },
  {
    role: 'agent',
    text: "⚠️ **ALERT:** 2 missions approaching deadline threshold.\n\n- **API Integration** — due in `18 hours` (40% complete)\n- **Database Migration** — due in `2 days` (not started)\n\nRecommend prioritizing *API Integration* to **Ring 1** for immediate action.",
  },
  {
    role: 'captain',
    text: "Help me plan tomorrow's work schedule.",
  },
  {
    role: 'agent',
    text: "### Optimized Duty Cycle Plan\n\n- [x] **MORNING** (4h) — `Deploy Authentication System` — high complexity, peak cognitive performance\n- [ ] **AFTERNOON** (3h) — `API Integration` subtasks — moderate complexity, deadline-critical\n- [ ] **EVENING** (1h) — Administrative tasks & code review\n\n---\n\n**Projected outcome:** 3 missions advanced, 1 fully completed\n\n*Efficiency projection:* **+42%** vs standard approach",
  },
  {
    role: 'captain',
    text: "What tasks should I delegate or defer?",
  },
  {
    role: 'agent',
    text: "### Strategic Analysis\n\n**DEFER:**\n- `Documentation updates` (Ring 6, no deadline) — low impact\n\n**DELEGATE candidates:**\n- `CSS refactoring` — straightforward, well-defined scope\n- `Test coverage` — parallelizable work\n\n**KEEP** on critical path:\n- Authentication, API integration, database work\n\n> This frees **8 hours** for high-priority objectives.",
  },
  {
    role: 'captain',
    text: "Estimate how long until I clear Ring 1.",
  },
  {
    role: 'agent',
    text: "### Ring 1 Clearance Estimate\n\n| Metric | Value |\n|--------|-------|\n| Critical missions | 3 |\n| Total effort | 14 hours |\n| Avg completion rate | 5.2h/day |\n| **Projected clearance** | **2.7 days** |\n\n> 💡 *With optimal scheduling, could reduce to* **2 days**.",
  },
];

function AgentAvatar({ agentName, agentImage }: { agentName: string; agentImage: string }) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <img
        src={agentImage}
        alt={agentName}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <div className="text-sm text-indigo-300 font-mono uppercase tracking-[0.3em] mb-1">A.I. Navigation System</div>
        <div className="text-2xl text-indigo-100 font-mono font-bold tracking-wider mb-2">{agentName}</div>
        <div className="flex items-center justify-center gap-2 text-xs text-indigo-400/80 font-mono">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>ACTIVE • LEARNING MODE</span>
        </div>
      </div>
    </div>
  );
}

export default function SpaceCaptainChat() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const { settings } = useSettings();
  const { user } = useAuth();
  const captainName = user?.name?.toUpperCase() ?? 'CAPTAIN';

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const captainMsg: Message = { role: 'captain', text: inputValue.trim() };
    setMessages((prev) => [...prev, captainMsg]);
    setInputValue('');

    // Mock agent response
    setTimeout(() => {
      const agentMsg: Message = {
        role: 'agent',
        text: "Understood, Captain. I'm processing your request. This feature is currently under development — full AI capabilities coming soon. Standing by.",
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const collapsed = (
    <button
      onClick={() => setIsExpanded(true)}
      className="group relative flex items-center gap-2 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-slate-900/90
        backdrop-blur-xl border border-indigo-400/40 rounded-2xl px-4 py-3
        shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
        hover:border-indigo-400/70 transition-all duration-300"
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

  const expanded = createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.85)' }}
    >
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={() => setIsExpanded(false)} />

      {/* Chat panel - BIGGER */}
      <div
        className="relative m-auto w-full max-w-[80vw] h-[80vh] flex rounded-3xl overflow-hidden
          border-2 border-indigo-400/40 shadow-2xl shadow-indigo-500/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Agent panel - WIDER */}
        <div className="w-80 flex-shrink-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex flex-col relative overflow-hidden border-r-2 border-indigo-500/30">
          {/* Animated scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99,102,241,0.4) 2px, rgba(99,102,241,0.4) 4px)',
            }}
          />

          {/* Agent avatar - BIGGER */}
          <div className="flex-1 relative"><AgentAvatar agentName={settings.agentName} agentImage={settings.agentImage} /></div>

          {/* Agent info panel */}
          <div className="p-5 border-t-2 border-indigo-500/40 bg-black/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-green-300 text-sm font-mono font-bold tracking-wider">ONLINE</span>
            </div>
            <div className="text-white text-lg font-bold font-mono mb-1">{settings.agentName}</div>
            <div className="text-indigo-300/80 text-xs font-mono mb-1">Autonomous Reasoning &amp;</div>
            <div className="text-indigo-300/80 text-xs font-mono mb-3">Intelligent Assistant v7.0</div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-indigo-400/70">UPTIME</span>
                <span className="text-indigo-200">99.97%</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-indigo-400/70">TASKS ANALYZED</span>
                <span className="text-indigo-200">1,247</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-indigo-400/70">EFFICIENCY</span>
                <span className="text-green-300">▲ 34.7%</span>
              </div>
            </div>

            <div className="flex gap-1.5 mb-2">
              <div className="flex-1 bg-indigo-900/70 rounded px-2 py-1 text-[10px] font-mono text-indigo-200 text-center border border-indigo-600/30">
                TASK MGMT
              </div>
              <div className="flex-1 bg-purple-900/70 rounded px-2 py-1 text-[10px] font-mono text-purple-200 text-center border border-purple-600/30">
                PLANNING
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className="flex-1 bg-blue-900/70 rounded px-2 py-1 text-[10px] font-mono text-blue-200 text-center border border-blue-600/30">
                ANALYSIS
              </div>
              <div className="flex-1 bg-cyan-900/70 rounded px-2 py-1 text-[10px] font-mono text-cyan-200 text-center border border-cyan-600/30">
                INSIGHTS
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chat area */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 via-indigo-950/50 to-slate-950 relative">
          {/* Starfield background */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent), radial-gradient(1px 1px at 33% 80%, white, transparent)',
              backgroundSize: '200px 200px',
              backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px, 150px 30px, 90px 180px',
            }}
          />

          {/* Header - Enhanced */}
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
                  BRIDGE COMMUNICATIONS
                  <span className="text-indigo-400">⟩⟩</span>
                </div>
                <div className="text-indigo-400/60 font-mono text-xs">SECURE CHANNEL • ENCRYPTION: AES-256</div>
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

          {/* Messages - BIGGER scroll area */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 scrollbar-thin relative z-10">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'captain' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar - BIGGER */}
                <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-lg font-bold border-2
                  ${msg.role === 'agent'
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-indigo-400/50 text-white shadow-lg shadow-indigo-500/40'
                    : 'bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 border-amber-400/50 text-white shadow-lg shadow-amber-500/40'
                  }`}
                >
                  {msg.role === 'agent' ? (
                    <img src={settings.agentImage} alt={settings.agentName} className="w-full h-full object-cover rounded-full" />
                  ) : '👨‍🚀'}
                </div>

                {/* Bubble - BIGGER */}
                <div className={`max-w-[70%] ${msg.role === 'captain' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                  <div className={`flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest
                    ${msg.role === 'agent' ? 'text-indigo-400' : 'text-amber-400'}`}
                  >
                    {msg.role === 'agent' ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        {settings.agentName} • AI ASSISTANT
                      </>
                    ) : (
                      <>
                        CAPTAIN {captainName} • COMMANDING OFFICER
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      </>
                    )}
                  </div>
                  <div
                    className={`px-5 py-3.5 rounded-2xl text-base leading-relaxed font-sans border-2
                      ${msg.role === 'agent'
                        ? 'bg-indigo-900/70 border-indigo-500/40 text-indigo-50 rounded-tl-sm shadow-lg shadow-indigo-900/30'
                        : 'bg-gradient-to-br from-amber-900/80 to-orange-900/70 border-amber-500/40 text-amber-50 rounded-tr-sm shadow-lg shadow-amber-900/30'
                      }`}
                  >
                    {msg.role === 'agent' ? (
                      <MarkdownRenderer content={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input - Enhanced */}
          <div className="px-6 py-4 border-t-2 border-indigo-500/30 bg-black/40 backdrop-blur-sm relative z-10">
            <div className="flex gap-3 items-center mb-2">
              <div className="text-amber-400/80 font-mono text-sm font-bold whitespace-nowrap flex items-center gap-2">
                <span className="text-amber-500">►</span>
                CAPTAIN
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter command or query..."
                className="flex-1 bg-indigo-950/80 border-2 border-indigo-500/40 rounded-xl px-5 py-3
                  text-white text-base font-mono placeholder-indigo-500/60
                  focus:outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30
                  transition-all duration-200 shadow-inner"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:from-indigo-500 hover:to-purple-500
                  disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed
                  text-white text-base font-mono font-bold rounded-xl
                  transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/40
                  border-2 border-indigo-400/30 disabled:border-slate-600/30"
              >
                TRANSMIT ›
              </button>
            </div>
            <div className="text-indigo-500/40 font-mono text-[10px] mt-1.5 text-center">
              ⚠ AI capabilities in development • Responses are simulated
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[998]">
        {collapsed}
      </div>
      {isExpanded && expanded}
    </>
  );
}
