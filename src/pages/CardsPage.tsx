import { useState } from 'react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ViewModeSwitcher from '../components/ViewModeSwitcher';
import { useTasks } from '../contexts/TaskContext';
import type { BullseyeRank, RankedTask } from '../types/task';

const RANK_ORDER: BullseyeRank[] = [7, 6, 5, 4, 3, 2, 1] as BullseyeRank[];
const RANK_LABELS: Record<number, string> = {
  1: '☀️ Ring 1 — Core',
  2: '🔥 Ring 2 — Critical',
  3: '⚡ Ring 3 — High',
  4: '🌟 Ring 4 — Important',
  5: '💫 Ring 5 — Normal',
  6: '🌙 Ring 6 — Low',
  7: '❄️ Ring 7 — Backlog',
};

interface TaskCardProps {
  task: RankedTask;
  onClick: () => void;
}

function TaskCard({ task, onClick }: TaskCardProps) {
  const completedSubtasks = task.subtasks?.filter((s: any) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      className="bg-gradient-to-br from-purple-800/40 via-indigo-800/40 to-purple-800/40 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 cursor-pointer"
      style={{
        borderLeftColor: task.color || '#a855f7',
        borderLeftWidth: '4px',
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-white font-semibold text-sm flex-1 line-clamp-2">
          {task.title}
        </h3>
        {task.completed && <span className="text-xl ml-2">✅</span>}
      </div>

      {task.description && (
        <p className="text-purple-200/70 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="bg-purple-600/50 text-purple-100 px-2 py-1 rounded-full">
          Rank {task.rank}
        </span>
        <span className="bg-indigo-600/50 text-indigo-100 px-2 py-1 rounded-full">
          C{task.complexity}
        </span>
        {totalSubtasks > 0 && (
          <span className="bg-pink-600/50 text-pink-100 px-2 py-1 rounded-full">
            🌙 {completedSubtasks}/{totalSubtasks}
          </span>
        )}
      </div>

      {task.dueDate && (
        <div className="mt-2 text-xs text-purple-300/80">
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default function CardsPage() {
  const { rankedTasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState<RankedTask | null>(null);

  // Group tasks by rank (1=most important, 7=least)
  const tasksByRank: Record<number, RankedTask[]> = {};
  for (let i = 1; i <= 7; i++) tasksByRank[i] = [];

  rankedTasks.filter((t) => !t.completed).forEach((task) => {
    const r = task.rank >= 1 && task.rank <= 7 ? task.rank : 7;
    tasksByRank[r].push(task);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
      <ViewModeSwitcher />

      <div className="max-w-[95vw] mx-auto mt-16">

        <div className="flex justify-center gap-16 overflow-x-auto pb-4">
          {RANK_ORDER.map((rank) => {
            const tasks = tasksByRank[rank];
            if (tasks.length === 0) return null;

            return (
              <div key={rank} className="flex-shrink-0 w-72 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 whitespace-nowrap">
                  {RANK_LABELS[rank]}
                  <span className="text-sm font-normal text-purple-300/70">
                    ({tasks.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {rankedTasks.filter((t) => !t.completed).length === 0 && (
          <div className="text-center py-20">
            <p className="text-7xl mb-4">📇</p>
            <p className="text-purple-200 text-lg mb-6">No active tasks</p>
          </div>
        )}
      </div>

      {/* Task detail modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(0, 0, 0, 0.5)',
          }}
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-purple-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-full shadow-lg"
                style={{ backgroundColor: selectedTask.color }}
              />
              <h2 className="text-xl font-bold text-white flex-1">
                {selectedTask.title}
              </h2>
              <button
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white transition-all"
                onClick={() => setSelectedTask(null)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-purple-300/70 text-xs">Priority</div>
                  <div className="text-white font-semibold">{selectedTask.priority}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-purple-300/70 text-xs">Complexity</div>
                  <div className="text-white font-semibold">C{selectedTask.complexity}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-purple-300/70 text-xs">Rank</div>
                  <div className="text-white font-semibold">{selectedTask.rank}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-purple-300/70 text-xs">Status</div>
                  <div className="text-white font-semibold">
                    {selectedTask.completed ? '✅ Done' : '⏳ Active'}
                  </div>
                </div>
              </div>

              {selectedTask.description && (
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-purple-300/70 text-xs mb-1">Description</div>
                  <div className="text-white/90">
                    <MarkdownRenderer content={String(selectedTask.description || '')} />
                  </div>
                </div>
              )}

              {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-purple-300/70 text-xs mb-2">Subtasks</div>
                  <div className="space-y-1">
                    {(selectedTask.subtasks as any[]).map((sub: any) => (
                      <div
                        key={sub.id}
                        className="text-white/80 text-xs flex items-center gap-2"
                      >
                        <span>{sub.completed ? '✅' : '⏳'}</span>
                        <span className={sub.completed ? 'line-through opacity-60' : ''}>
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
