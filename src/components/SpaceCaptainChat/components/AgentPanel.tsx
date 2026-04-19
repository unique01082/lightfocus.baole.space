import type { TimelineEntry } from '../types';
import AgentAvatar from './AgentAvatar';

interface AgentPanelProps {
  agentName: string;
  agentImage: string;
  timeline: TimelineEntry[];
}

export default function AgentPanel({ agentName, agentImage, timeline }: AgentPanelProps) {
  return (
    <div className="w-80 flex-shrink-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex flex-col relative overflow-hidden border-r-2 border-indigo-500/30">
      {/* Animated scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99,102,241,0.4) 2px, rgba(99,102,241,0.4) 4px)',
        }}
      />

      {/* Agent avatar */}
      <div className="flex-1 relative">
        <AgentAvatar agentName={agentName} agentImage={agentImage} />
      </div>

      {/* Agent info panel */}
      <div className="p-5 border-t-2 border-indigo-500/40 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
          <span className="text-green-300 text-sm font-mono font-bold tracking-wider">ONLINE</span>
        </div>
        <div className="text-white text-lg font-bold font-mono mb-1">{agentName}</div>
        <div className="text-indigo-300/80 text-xs font-mono mb-1">Personal AI Companion</div>
        <div className="text-indigo-300/80 text-xs font-mono mb-3">Learning Your Patterns 🧠</div>

        {/* Timeline Stats */}
        <div className="mb-3 p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-lg">
          <div className="text-[10px] font-mono text-indigo-400/70 mb-2 uppercase tracking-wider">
            Today's Activity
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-indigo-300/70">💬 Conversations</span>
              <span className="text-indigo-200 font-bold">
                {timeline.filter((e) => e.type === 'conversation').length}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-indigo-300/70">📋 Your Activities</span>
              <span className="text-amber-200 font-bold">
                {timeline.filter((e) => e.type === 'user_activity').length}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-indigo-300/70">🤖 System Events</span>
              <span className="text-purple-200 font-bold">
                {timeline.filter((e) => e.type === 'system_event').length}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-indigo-300/70">📊 Feedback Requests</span>
              <span className="text-cyan-200 font-bold">
                {timeline.filter((e) => e.type === 'feedback_request').length}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-indigo-400/70">MOMENTUM</span>
            <span className="text-green-300">89/100 🔥</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-indigo-400/70">STREAK</span>
            <span className="text-indigo-200">8 days ⚡</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-indigo-400/70">LEARNING</span>
            <span className="text-purple-300">Active 🧠</span>
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
  );
}
