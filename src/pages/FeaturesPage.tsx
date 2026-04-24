import { Link } from 'react-router';

const features = [
  {
    icon: '🪐',
    title: 'Solar System View',
    description:
      'Visualize all your tasks as planets orbiting a sun. Priority determines orbit distance — the most critical tasks live closest to the center.',
    tag: 'Core',
    tagColor: 'bg-purple-600/60 text-purple-100',
  },
  {
    icon: '🎯',
    title: 'Bullseye Rings',
    description:
      'A concentric ring view that maps task urgency on a scale of 1–7. Get a bird\'s-eye view of your entire workload at a glance.',
    tag: 'Core',
    tagColor: 'bg-purple-600/60 text-purple-100',
  },
  {
    icon: '🤖',
    title: 'Space Captain AI',
    description:
      'Your personal AI productivity coach. Ask it to create tasks, prioritize your backlog, or give you a daily briefing — it learns your style over time.',
    tag: 'AI',
    tagColor: 'bg-pink-600/60 text-pink-100',
  },
  {
    icon: '🌙',
    title: 'Subtasks as Moons',
    description:
      'Break big tasks into subtasks that orbit their parent planet like moons. Completing a subtask turns its moon grey.',
    tag: 'Core',
    tagColor: 'bg-purple-600/60 text-purple-100',
  },
  {
    icon: '📋',
    title: 'Task List View',
    description:
      'Prefer a classic list? Switch to Task List view for a familiar tabular layout with search, filter, and bulk actions.',
    tag: 'View',
    tagColor: 'bg-indigo-600/60 text-indigo-100',
  },
  {
    icon: '🃏',
    title: 'Cards View',
    description:
      'See tasks as cards organized in a kanban-style layout. Drag-and-drop to reorder or change status quickly.',
    tag: 'View',
    tagColor: 'bg-indigo-600/60 text-indigo-100',
  },
  {
    icon: '⚡',
    title: 'Keyboard Shortcuts',
    description:
      'Power users rejoice — every major action has a keyboard shortcut. Create, complete, navigate and focus without touching the mouse.',
    tag: 'Productivity',
    tagColor: 'bg-cyan-700/60 text-cyan-100',
  },
  {
    icon: '🔐',
    title: 'Secure Auth',
    description:
      'Authenticate with your existing identity provider. Your data is encrypted and synced securely across all your devices.',
    tag: 'Security',
    tagColor: 'bg-green-700/60 text-green-100',
  },
  {
    icon: '📊',
    title: 'Productivity Stats',
    description:
      'Track your progress over time. See completion rates, streaks, and which priority rings you\'re clearing fastest.',
    tag: 'Insights',
    tagColor: 'bg-orange-600/60 text-orange-100',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-4">
            Features
          </h1>
          <p className="text-purple-200 text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need to stay laser-focused, built for the way your brain actually works.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 animate-in slide-in-from-bottom"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{feature.icon}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${feature.tagColor}`}>
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-purple-200/70 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-x-4 animate-in fade-in duration-700" style={{ animationDelay: '400ms' }}>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            Start for free →
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 border border-purple-400/50 text-purple-200 hover:text-white hover:border-purple-300 font-bold py-3 px-8 rounded-xl transition-all duration-300"
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}
