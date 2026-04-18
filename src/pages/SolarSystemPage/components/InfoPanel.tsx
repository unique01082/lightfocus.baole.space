import type { RankedTask, Task } from '../../../types/task';

interface InfoPanelProps {
  tasks: Task[];
  uiHidden: boolean;
  rankedTasks: RankedTask[];
}

export default function InfoPanel({ tasks, uiHidden, rankedTasks }: InfoPanelProps) {
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className={`info ${uiHidden ? 'ui-hidden' : ''}`}>
      <div
        style={{
          display: 'flex',
          gap: 30,
          fontSize: 12,
          color: 'var(--text-muted)',
        }}
      >
        <span>
          🪐 {activeTasks.length} Active Planets
        </span>
        <span>✅ {completedCount} Completed</span>
        <span>
          🌙{' '}
          {tasks.reduce(
            (s, t) => s + (t.subtasks?.length || 0),
            0
          )}{' '}
          Subtasks
        </span>
      </div>
    </div>
  );
}
