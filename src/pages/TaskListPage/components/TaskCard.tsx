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
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        <div className="task-card-left">
          <button
            className="task-check"
            onClick={() => onToggleComplete(task.id)}
            style={{ borderColor: task.color }}
          >
            {task.completed && '✓'}
          </button>
          <div>
            <div
              className="task-card-title"
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            >
              <span className="planet-dot" style={{ backgroundColor: task.color }} />
              {task.title}
            </div>
            {task.description && (
              <div className="task-card-desc">{task.description}</div>
            )}
          </div>
        </div>
        <div className="task-card-right">
          <span
            className="rank-badge"
            style={{
              background: `linear-gradient(135deg, ${task.color}, ${task.color}88)`,
            }}
          >
            Ring {task.rank}
          </span>
          <span
            className="priority-pill"
            style={{
              backgroundColor: PRIORITY_COLORS[task.priority] + '33',
              color: PRIORITY_COLORS[task.priority],
            }}
          >
            {task.priority}
          </span>
          <button
            className="delete-btn"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="task-card-meta">
        <span>🧩 C{task.complexity}</span>
        {task.dueDate && (
          <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
        <span>
          🌙 {task.subtasks.filter((s) => s.completed).length}/
          {task.subtasks.length} subtasks
        </span>
        <span>{ORBIT_LABELS[task.rank]}</span>
      </div>

      {task.subtasks.length > 0 && (
        <div className="subtask-list">
          {task.subtasks.map((sub) => (
            <div key={sub.id} className="subtask-item">
              <button
                className={`subtask-check ${sub.completed ? 'done' : ''}`}
                onClick={() => onToggleSubtask(task.id, sub.id)}
              >
                {sub.completed ? '✓' : ''}
              </button>
              <span
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
