import { Link } from 'react-router';

export default function HelpPage() {
  const RingBadge = ({ num, label }: { num: number; label: string }) => {
    const colors = {
      1: 'from-red-500 to-orange-500',
      2: 'from-orange-500 to-yellow-500',
      3: 'from-yellow-500 to-lime-500',
      4: 'from-lime-500 to-green-500',
      5: 'from-green-500 to-cyan-500',
      6: 'from-cyan-500 to-blue-500',
      7: 'from-blue-500 to-purple-500',
    };
    return (
      <div className="flex items-center gap-3 group">
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${colors[num as keyof typeof colors]} text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          {num}
        </span>
        <span className="text-purple-100 group-hover:text-white transition-colors">{label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
      <div className="max-w-6xl mx-auto mt-12">
        <div className="text-center mb-12 animate-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-3">
            Help & Guide
          </h1>
          <p className="text-purple-200 text-lg">Learn how to use LightFocus — the task manager that learns YOUR productivity DNA</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <section className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 animate-in slide-in-from-left duration-700">
            <h2 className="text-2xl font-bold text-purple-200 mb-4 flex items-center gap-2">
              <span className="text-3xl">🎯</span> Bullseye Prioritization
            </h2>
            <p className="text-purple-100/80 mb-4 leading-relaxed">
              Tasks are automatically ranked on a scale of 1–7 based on <strong className="text-purple-300">priority</strong>,{' '}
              <strong className="text-purple-300">complexity</strong>, and <strong className="text-purple-300">due date urgency</strong>. Lower rank = closer to the sun = more important.
            </p>
            <div className="space-y-2">
              <RingBadge num={1} label="Critical — innermost orbit" />
              <RingBadge num={2} label="Very High" />
              <RingBadge num={3} label="High" />
              <RingBadge num={4} label="Medium" />
              <RingBadge num={5} label="Low" />
              <RingBadge num={6} label="Very Low" />
              <RingBadge num={7} label="Minimal — outermost orbit" />
            </div>
          </section>

          <section className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 animate-in slide-in-from-right duration-700">
            <h2 className="text-2xl font-bold text-purple-200 mb-4 flex items-center gap-2">
              <span className="text-3xl">🪐</span> Creating Tasks
            </h2>
            <p className="text-purple-100/80 mb-4 leading-relaxed">
              Press <kbd className="px-2 py-1 bg-purple-700/50 border border-purple-500/50 rounded text-sm font-mono">N</kbd> or click <strong className="text-purple-300">New Task</strong> to create a task. Each task becomes a planet in the solar system.
            </p>
            <ul className="space-y-2 text-purple-100/80">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-purple-300">Title</strong> — The planet's name</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-purple-300">Priority</strong> — Critical, High, Medium, Low, None</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-purple-300">Complexity</strong> — 1–5 (affects planet size)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-purple-300">Due Date</strong> — Adds urgency to the ranking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-purple-300">Color</strong> — Choose your planet's color</span>
              </li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 animate-in slide-in-from-left duration-700" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-bold text-purple-200 mb-4 flex items-center gap-2">
              <span className="text-3xl">🌙</span> Subtasks
            </h2>
            <p className="text-purple-100/80 leading-relaxed">
              Subtasks orbit their parent planet as moons. They orbit in 3D like electrons around a nucleus.
              Mark subtasks complete to turn their moons <span className="text-green-400 font-semibold">green</span>.
            </p>
          </section>

          <section className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 animate-in slide-in-from-right duration-700" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-bold text-purple-200 mb-4 flex items-center gap-2">
              <span className="text-3xl">⌨️</span> Keyboard Shortcuts
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { key: 'N', desc: 'New task' },
                { key: 'L', desc: 'Toggle planet labels' },
                { key: 'M', desc: 'Toggle moon labels' },
                { key: 'O', desc: 'Toggle orbit lines' },
                { key: 'H', desc: 'Hide/show UI' },
                { key: 'R', desc: 'Reset camera view' },
                { key: 'Space', desc: 'Pause/resume animation' },
                { key: 'Escape', desc: 'Close panels' },
              ].map(({ key, desc }) => (
                <div key={key} className="flex flex-col gap-1">
                  <kbd className="px-2 py-1 bg-purple-700/50 border border-purple-500/50 rounded text-center font-mono text-xs">{key}</kbd>
                  <span className="text-purple-200/80 text-xs">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 animate-in slide-in-from-left duration-700" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-purple-200 mb-4 flex items-center gap-2">
              <span className="text-3xl">🎛️</span> Mission Control
            </h2>
            <p className="text-purple-100/80 mb-4 leading-relaxed">
              The top-left panel controls animation speed, bloom effects, orbit visibility, and moon visibility.
            </p>
            <ul className="space-y-2 text-purple-100/80">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-purple-300">Speed</strong> — Adjust orbital speed (0–10x)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-purple-300">Bloom</strong> — Control glow intensity or let it auto-adjust</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-purple-300">Orbits</strong> — Show/hide orbit ring lines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong className="text-purple-300">Moons</strong> — Show/hide subtask moons</span>
              </li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 animate-in slide-in-from-right duration-700" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-purple-200 mb-4 flex items-center gap-2">
              <span className="text-3xl">💾</span> Data Storage
            </h2>
            <p className="text-purple-100/80 leading-relaxed">
              All tasks are stored in your browser's <code className="px-2 py-0.5 bg-purple-700/50 border border-purple-500/50 rounded text-sm font-mono">localStorage</code>.
              Data persists across sessions but is local to this browser.
            </p>
          </section>
        </div>

        <div className="text-center animate-in fade-in duration-700" style={{ animationDelay: '400ms' }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            <span>←</span> Back to Solar System
          </Link>
        </div>
      </div>
    </div>
  );
}
