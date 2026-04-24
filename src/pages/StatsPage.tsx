import { Link } from 'react-router';
import { useTasks } from '../contexts/TaskContext';

const ORBIT_LABELS: Record<number, string> = {
  1: 'Critical',
  2: 'Very High',
  3: 'High',
  4: 'Medium',
  5: 'Low',
  6: 'Very Low',
  7: 'Minimal',
};

const RING_COLORS: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-lime-500',
  5: 'bg-green-500',
  6: 'bg-cyan-500',
  7: 'bg-blue-500',
};

export default function StatsPage() {
  const { tasks, rankedTasks } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalSubtasks = tasks.reduce((sum, t) => sum + (t.subtasks?.length ?? 0), 0);
  const completedSubtasks = tasks.reduce(
    (sum, t) => sum + (t.subtasks?.filter((s: any) => s.completed).length ?? 0),
    0,
  );

  // Tasks per ring
  const ringCounts = Array.from({ length: 7 }, (_, i) => {
    const ring = i + 1;
    const ringTasks = rankedTasks.filter((t) => t.rank === ring);
    return {
      ring,
      label: ORBIT_LABELS[ring],
      total: ringTasks.length,
      completed: ringTasks.filter((t) => t.completed).length,
    };
  });

  const maxRingTotal = Math.max(...ringCounts.map((r) => r.total), 1);

  // Most complex active task
  const hardestTask = [...tasks]
    .filter((t) => !t.completed)
    .sort((a, b) => (b.complexity ?? 0) - (a.complexity ?? 0))[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
      <div className="max-w-3xl mx-auto mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-8 text-sm"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8 animate-in slide-in-from-top duration-700">
          📊 Productivity Stats
        </h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-in slide-in-from-top duration-700">
          {[
            { label: 'Total', value: totalTasks, icon: '📋', color: 'text-white' },
            { label: 'Active', value: activeTasks, icon: '⚡', color: 'text-yellow-300' },
            { label: 'Done', value: completedTasks, icon: '✅', color: 'text-green-300' },
            { label: 'Rate', value: `${completionRate}%`, icon: '🎯', color: 'text-pink-300' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-purple-300/60 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Ring distribution */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 mb-6 animate-in slide-in-from-left duration-700">
          <h2 className="text-lg font-bold text-purple-200 mb-5">Tasks by Priority Ring</h2>
          <div className="space-y-3">
            {ringCounts.map((r) => (
              <div key={r.ring} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-purple-300 w-5 text-right shrink-0">{r.ring}</span>
                <span className="text-xs text-purple-300/60 w-20 shrink-0">{r.label}</span>
                <div className="flex-1 bg-purple-900/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${RING_COLORS[r.ring]}`}
                    style={{ width: `${(r.total / maxRingTotal) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-purple-200 w-14 text-right shrink-0">
                  {r.completed}/{r.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subtask stats + hardest task */}
        <div className="grid sm:grid-cols-2 gap-6 animate-in slide-in-from-bottom duration-700">
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-purple-200 mb-4">🌙 Subtasks</h2>
            <div className="flex justify-between items-center mb-3">
              <span className="text-purple-300/70 text-sm">Completed</span>
              <span className="text-white font-bold">{completedSubtasks} / {totalSubtasks}</span>
            </div>
            <div className="w-full bg-purple-900/50 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full transition-all duration-700"
                style={{ width: totalSubtasks > 0 ? `${(completedSubtasks / totalSubtasks) * 100}%` : '0%' }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-purple-200 mb-4">🏋️ Hardest Active Task</h2>
            {hardestTask ? (
              <>
                <p className="text-white font-semibold text-sm line-clamp-2 mb-2">{hardestTask.title}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-600/50 text-orange-100">
                    Complexity {hardestTask.complexity}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-600/50 text-purple-100 capitalize">
                    {hardestTask.priority}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-purple-300/60 text-sm">All tasks complete! 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
