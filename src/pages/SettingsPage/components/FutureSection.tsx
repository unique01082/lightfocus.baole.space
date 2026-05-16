type FutureSectionProps = {
  title: string;
  icon: string;
  description: string;
  items: Array<{ icon: string; label: string; detail?: string }>;
};

export default function FutureSection({ title, icon, description, items }: FutureSectionProps) {
  return (
    <div className="bg-black/30 backdrop-blur-xl border border-white/8 rounded-2xl p-6 space-y-4 opacity-60">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-white/50 flex items-center gap-2">
          {icon} {title}
        </h2>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400/70
          border border-indigo-500/25 font-mono font-bold tracking-wider">
          COMING SOON
        </span>
      </div>
      <p className="text-sm text-white/30">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 bg-white/4"
          >
            <span className="text-xl">{item.icon}</span>
            <div>
              <div className="text-sm font-mono text-white/30">{item.label}</div>
              {item.detail && <div className="text-xs text-white/20 mt-0.5">{item.detail}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
