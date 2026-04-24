import pk from '../../package.json';

type ChangeType = 'feat' | 'fix' | 'improve' | 'breaking';

interface ChangeEntry {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  highlight?: string;
  changes: ChangeEntry[];
}

const releases: Release[] = [
  {
    version: pk.version,
    date: 'Apr 24, 2026',
    highlight: 'Layout system & public pages',
    changes: [
      { type: 'feat', text: 'Introduced AuthenticatedLayout, AuthLayout, PublicLayout, and MinimalLayout' },
      { type: 'feat', text: 'Added /about, /features, /changelog, /profile, /stats pages' },
      { type: 'feat', text: 'Help page moved to public layout — accessible without login' },
      { type: 'feat', text: '404 Not Found page with Minimal layout' },
      { type: 'improve', text: 'Refactored App.tsx to use nested route-based layouts' },
    ],
  },
  {
    version: '0.9.0',
    date: 'Apr 10, 2026',
    highlight: 'Space Captain AI',
    changes: [
      { type: 'feat', text: 'Introduced Space Captain AI chat panel' },
      { type: 'feat', text: 'AI can create, update and prioritize tasks via natural language' },
      { type: 'feat', text: 'Timeline view merges AI conversation with task activity' },
      { type: 'improve', text: 'Agent personality configurable from Settings page' },
      { type: 'fix', text: 'Fixed message ordering when streaming responses were out-of-order' },
    ],
  },
  {
    version: '0.8.0',
    date: 'Mar 28, 2026',
    highlight: 'Cards view & keyboard shortcuts',
    changes: [
      { type: 'feat', text: 'Added Cards (kanban) view for tasks' },
      { type: 'feat', text: 'Global keyboard shortcuts — press ? to see all shortcuts' },
      { type: 'feat', text: 'Shortcuts page at /shortcuts' },
      { type: 'improve', text: 'View Mode Switcher animates between Solar System, Bullseye, List and Cards' },
      { type: 'fix', text: 'Solar system animation no longer freezes on low-power mode' },
    ],
  },
  {
    version: '0.7.0',
    date: 'Mar 14, 2026',
    highlight: 'Authentication & sync',
    changes: [
      { type: 'feat', text: 'OAuth authentication via Authentik' },
      { type: 'feat', text: 'Tasks synced to backend API — works across devices' },
      { type: 'feat', text: 'Protected routes redirect unauthenticated users to /auth' },
      { type: 'breaking', text: 'Local-storage-only mode removed in favour of API sync' },
    ],
  },
  {
    version: '0.5.0',
    date: 'Feb 20, 2026',
    highlight: 'Bullseye view',
    changes: [
      { type: 'feat', text: 'Bullseye ring visualization for priority 1–7' },
      { type: 'feat', text: 'Task drag-and-drop to change priority ring' },
      { type: 'improve', text: 'Planet sizes scaled to subtask count' },
    ],
  },
  {
    version: '0.1.0',
    date: 'Jan 5, 2026',
    highlight: 'Initial release',
    changes: [
      { type: 'feat', text: 'Solar system task visualization' },
      { type: 'feat', text: 'Subtasks rendered as orbiting moons' },
      { type: 'feat', text: 'Task create / edit / delete' },
      { type: 'feat', text: 'Local storage persistence' },
    ],
  },
];

const typeConfig: Record<ChangeType, { label: string; color: string }> = {
  feat: { label: 'New', color: 'bg-purple-600/60 text-purple-100' },
  fix: { label: 'Fix', color: 'bg-red-600/60 text-red-100' },
  improve: { label: 'Improved', color: 'bg-blue-600/60 text-blue-100' },
  breaking: { label: 'Breaking', color: 'bg-orange-600/60 text-orange-100' },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-4">
            Changelog
          </h1>
          <p className="text-purple-300/70 text-lg">What's new in LightFocus</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-purple-500/60 via-purple-500/30 to-transparent" />

          <div className="space-y-10">
            {releases.map((release, i) => (
              <div
                key={release.version}
                className="relative pl-14 animate-in slide-in-from-left duration-700"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Dot */}
                <div className={`absolute left-3.5 top-1 w-3 h-3 rounded-full border-2 shadow-lg ${i === 0 ? 'bg-pink-400 border-pink-300 shadow-pink-500/50' : 'bg-purple-500 border-purple-400 shadow-purple-500/30'}`} />

                <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 hover:border-purple-400/60 transition-all duration-300">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className={`font-mono font-bold text-lg ${i === 0 ? 'text-pink-300' : 'text-purple-200'}`}>
                      v{release.version}
                    </span>
                    {i === 0 && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-600/50 text-pink-100">
                        Latest
                      </span>
                    )}
                    {release.highlight && (
                      <span className="text-sm text-purple-300/70">— {release.highlight}</span>
                    )}
                  </div>
                  <p className="text-purple-400/60 text-xs mb-4">{release.date}</p>

                  <ul className="space-y-2">
                    {release.changes.map((change, j) => {
                      const cfg = typeConfig[change.type];
                      return (
                        <li key={j} className="flex items-start gap-2.5 text-sm">
                          <span className={`shrink-0 mt-0.5 text-xs font-semibold px-1.5 py-0.5 rounded ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="text-purple-100/80">{change.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
