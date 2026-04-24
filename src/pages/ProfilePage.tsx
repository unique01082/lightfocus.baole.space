import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { tasks } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalSubtasks = tasks.reduce((sum, t) => sum + (t.subtasks?.length ?? 0), 0);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
      <div className="max-w-2xl mx-auto mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-8 text-sm"
        >
          ← Back to Dashboard
        </Link>

        {/* Avatar + name */}
        <div className="flex items-center gap-6 mb-8 animate-in slide-in-from-top duration-700">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-purple-400/50 shadow-xl shadow-purple-500/30"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-purple-500/30">
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-purple-300/70 text-sm mt-1">{user.email}</p>
            <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full bg-purple-600/50 text-purple-100 capitalize">
              {user.role}
            </span>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-in slide-in-from-bottom duration-700">
          {[
            { label: 'Total Tasks', value: totalTasks, icon: '📋', color: 'text-white' },
            { label: 'Active', value: activeTasks, icon: '⚡', color: 'text-yellow-300' },
            { label: 'Completed', value: completedTasks, icon: '✅', color: 'text-green-300' },
            { label: 'Subtasks', value: totalSubtasks, icon: '🌙', color: 'text-pink-300' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-purple-300/60 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Completion bar */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 mb-6 animate-in fade-in duration-700">
          <div className="flex justify-between items-center mb-3">
            <span className="text-purple-200 font-semibold">Completion Rate</span>
            <span className="text-white font-bold text-lg">{completionRate}%</span>
          </div>
          <div className="w-full bg-purple-900/50 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 shadow-lg shadow-purple-500/50"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in duration-700">
          <Link
            to="/settings"
            className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
          >
            ⚙️ Settings
          </Link>
          <Link
            to="/stats"
            className="flex-1 text-center px-6 py-3 border border-purple-400/50 text-purple-200 hover:text-white hover:border-purple-300 font-bold rounded-xl transition-all duration-300"
          >
            📊 View Stats
          </Link>
          <button
            className="flex-1 px-6 py-3 bg-red-600/40 hover:bg-red-600/70 border border-red-500/30 text-red-200 hover:text-white font-bold rounded-xl transition-all duration-300"
            onClick={signOut}
          >
            🚪 Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
