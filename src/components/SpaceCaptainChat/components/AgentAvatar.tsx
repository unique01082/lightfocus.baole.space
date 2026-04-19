interface AgentAvatarProps {
  agentName: string;
  agentImage: string;
}

export default function AgentAvatar({ agentName, agentImage }: AgentAvatarProps) {
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
        <div className="text-sm text-indigo-300 font-mono uppercase tracking-[0.3em] mb-1">
          A.I. Navigation System
        </div>
        <div className="text-2xl text-indigo-100 font-mono font-bold tracking-wider mb-2">
          {agentName}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-indigo-400/80 font-mono">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>ACTIVE • LEARNING MODE</span>
        </div>
      </div>
    </div>
  );
}
