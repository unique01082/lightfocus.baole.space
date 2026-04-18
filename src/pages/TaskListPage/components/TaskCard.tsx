import type { BullseyeRank, Priority, RankedTask } from '../../../types/task';
import SubtaskAdder from './SubtaskAdder';

const ORBIT_LABELS: Record<BullseyeRank, string> = {
  1: 'Critical',
  2: 'Very High',
  3: 'High',
  4: 'Medium',
  5: 'Low',
  6: 'Very Low',
  7: 'Minimal',
};

const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#e63946',
  high: '#f77f00',
  medium: '#ffd60a',
  low: '#2a9d8f',
  none: '#6c757d',
};

interface TaskCardProps {
  task: RankedTask;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onToggleSubtask,
  onAddSubtask,
}: TaskCardProps) {
  return (
    <div className={`bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            className="w-6 h-6 rounded border-2 flex items-center justify-center transition-all hover:scale-110 flex-shrink-0 mt-1"
            onClick={() => onToggleComplete(task.id)}
            style={{ borderColor: task.color }}
          >
            {task.completed && <span className="text-sm">✓</span>}
          </button>
          <div className="flex-1">
            <div
              className="font-semibold text-purple-100 flex items-center gap-2"
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            >
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: task.color }} />
              {task.title}
            </div>
            {task.description && typeof task.description === 'string' && (
              <div className="text-purple-200/70 text-sm mt-1">{task.description}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${task.color}, ${task.color}88)`,
            }}
          >
            Ring {task.rank}
          </span>
          <span
            className="px-2 py-1 rounded text-xs font-semibold"
            style={{
              backgroundColor: PRIORITY_COLORS[task.priority] + '33',
              color: PRIORITY_COLORS[task.priority],
            }}
          >
            {task.priority}
          </span>
          <button
            className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 transition-all flex items-center justify-center text-sm"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-purple-300/80 mb-4">
        <span>🧩 C{task.complexity}</span>
        {task.dueDate && typeof task.dueDate === 'string' && (
          <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
        <span>
          🌙 {task.subtasks?.filter((s) => s.completed).length || 0}/
          {task.subtasks?.length || 0} subtasks
        </span>
        <span>{ORBIT_LABELS[task.rank]}</span>
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="space-y-2 mb-4">
          {task.subtasks.map((sub) => (
            <div key={sub.id} className="flex items-center gap-2">
              <button
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all text-xs ${
                  sub.completed
                    ? 'bg-green-500/30 border-green-500 text-green-300'
                    : 'border-purple-400/30 hover:border-purple-400'
                }`}
                onClick={() => onToggleSubtask(task.id, sub.id)}
              >
                {sub.completed ? '✓' : ''}
              </button>
              <span
                className="text-sm text-purple-100"
                style={{
                  textDecoration: sub.completed ? 'line-through' : 'none',
                  opacity: sub.completed ? 0.5 : 1,
                }}
              >
                {sub.title}
              </span>
            </div>
          ))}
        </div>
      )}

      <SubtaskAdder taskId={task.id} onAdd={onAddSubtask} />
    </div>
  );
}
