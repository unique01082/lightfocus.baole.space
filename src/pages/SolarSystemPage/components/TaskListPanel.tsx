import { useState } from 'react';
import { Panel } from '../../../components/ui';
import type { BullseyeRank, RankedTask } from '../../../types/task';
import { groupByOrbit, ORBIT_META } from '../../../utils/ranking';

interface TaskListPanelProps {
  uiHidden: boolean;
  rankedTasks: RankedTask[];
  selectedTask: RankedTask | null;
  onSelectTask: (task: RankedTask | null) => void;
  onCompleteTask?: (id: string) => void;
}

function DueDateBadge({ dueDate, completed }: { dueDate: unknown; completed: boolean }) {
  if (!dueDate || completed) return null;
  const d = new Date(dueDate as string);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  const todayStr = now.toDateString();
  const isToday = d.toDateString() === todayStr;
  const isOverdue = d < now && !isToday;
  const label = d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  if (isOverdue) {
    return (
      <span className="text-[8px] font-mono font-bold text-red-400/90 bg-red-500/15 px-1 py-px rounded border border-red-500/30 ml-auto">
        ⚠ {label}
      </span>
    );
  }
  if (isToday) {
    return (
      <span className="text-[8px] font-mono font-bold text-amber-400/90 bg-amber-500/15 px-1 py-px rounded border border-amber-500/30 animate-pulse ml-auto">
        ◉ TODAY
      </span>
    );
  }
  return <span className="text-[8px] font-mono text-white/30 ml-auto">{label}</span>;
}

function TaskRow({
  task,
  isSelected,
  onSelect,
  onComplete,
}: {
  task: RankedTask;
  isSelected: boolean;
  onSelect: () => void;
  onComplete?: () => void;
}) {
  const done = task.subtasks?.filter((s) => s.completed).length ?? 0;
  const total = task.subtasks?.length ?? 0;
  const priShort = (task.priority ?? '').slice(0, 3).toUpperCase() || '---';
  const now = new Date();
  const dueD = task.dueDate ? new Date(task.dueDate as unknown as string) : null;
  const isOverdue = dueD && !task.completed && dueD < now && dueD.toDateString() !== now.toDateString();

  return (
    <div
      onClick={onSelect}
      className={`relative px-2.5 py-2 rounded cursor-pointer border-l-[3px] transition-all duration-150 select-none group/row
        ${isSelected ? 'bg-white/12 shadow-[0_0_10px_rgba(34,211,238,0.18)]' : 'bg-white/4 hover:bg-white/8'}
        ${isOverdue ? 'shadow-[inset_0_0_0_1px_rgba(239,68,68,0.2)]' : ''}`}
      style={{ borderLeftColor: task.color }}
    >
      <div className="flex items-start gap-1">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-white/90 truncate leading-tight">{task.title}</div>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-[9px] font-bold px-1 py-px rounded bg-white/8 text-white/45 tracking-wide">{priShort}</span>
            <span className="text-[9px] font-mono text-purple-300/60">C{task.complexity}</span>
            {total > 0 && <span className="text-[9px] font-mono text-pink-300/55">◐ {done}/{total}</span>}
            <DueDateBadge dueDate={task.dueDate} completed={task.completed} />
          </div>
          {total > 0 && (
            <div className="mt-1.5 h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${total > 0 ? Math.round((done / total) * 100) : 0}%`,
                  backgroundColor: done === total ? '#34d399' : task.color,
                  opacity: 0.7,
                }}
              />
            </div>
          )}
        </div>
        {onComplete && (
          <button
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            className="opacity-0 group-hover/row:opacity-100 transition-opacity shrink-0 w-5 h-5 flex items-center justify-center
              rounded border border-white/20 hover:border-green-400/60 hover:bg-green-500/15 hover:text-green-400 text-white/20 text-[10px] mt-0.5"
            title="Mark complete"
          >✓</button>
        )}
      </div>
      {isSelected && (
        <div className="absolute top-1/2 -translate-y-1/2 -right-px w-0.5 h-3/4 bg-cyan-400 rounded-l shadow-[0_0_4px_rgba(34,211,238,1)]" />
      )}
    </div>
  );
}

export default function TaskListPanel({
  uiHidden,
  rankedTasks,
  selectedTask,
  onSelectTask,
  onCompleteTask,
}: TaskListPanelProps) {
  const [minimized, setMinimized] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const grouped = groupByOrbit(rankedTasks);
  const activeTasks = rankedTasks.filter((t) => !t.completed);
  const completedTasks = rankedTasks.filter((t) => t.completed);
  const now = new Date();
  const overdueCount = activeTasks.filter((t) =>
    t.dueDate && new Date(t.dueDate as unknown as string) < now &&
    new Date(t.dueDate as unknown as string).toDateString() !== now.toDateString()
  ).length;
  const dueTodayCount = activeTasks.filter((t) =>
    t.dueDate && new Date(t.dueDate as unknown as string).toDateString() === now.toDateString()
  ).length;

  return (
    <Panel
      className={`${uiHidden ? 'ui-hidden' : ''} ${minimized ? 'w-auto' : 'w-60 md:w-72'} transition-all duration-300 shadow-[0_0_24px_rgba(168,85,247,0.2)]`}
      style={{ top: 20, right: 20 }}
    >
      {/* Header */}
      <div
        className="relative px-3 py-2.5 bg-gradient-to-r from-purple-500/15 to-pink-700/10 border-b border-purple-500/25 cursor-pointer hover:bg-purple-500/20 transition-all flex items-center justify-between group"
        onClick={() => setMinimized(!minimized)}
      >
        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_rgba(168,85,247,1)] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-purple-100 font-space">MISSIONS</span>
          <span className="text-[9px] font-mono text-purple-400/60 tabular-nums">[{activeTasks.length}]</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedTask && !minimized && (
            <button
              onClick={(e) => { e.stopPropagation(); onSelectTask(null); }}
              className="text-[9px] font-mono text-purple-400/60 hover:text-red-400 transition-colors px-1"
              title="Deselect"
            >✕</button>
          )}
          <span className="text-[10px] font-mono text-purple-500/50 group-hover:text-purple-300 transition-colors">
            {minimized ? '[+]' : '[−]'}
          </span>
        </div>
      </div>

      {!minimized && (
        <div className="max-h-[65vh] overflow-y-auto scrollbar-thin px-2 py-2 space-y-1">
          {/* Intel strip: overdue / due today alerts */}
          {(overdueCount > 0 || dueTodayCount > 0) && (
            <div className="flex items-center gap-3 px-1 pb-1.5 border-b border-white/8 mb-1">
              {overdueCount > 0 && (
                <span className="text-[9px] font-mono font-bold text-red-400/80">⚠ {overdueCount} OVERDUE</span>
              )}
              {dueTodayCount > 0 && (
                <span className="text-[9px] font-mono font-bold text-amber-400/70">◉ {dueTodayCount} TODAY</span>
              )}
            </div>
          )}

          {activeTasks.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <div className="text-3xl mb-2">🌠</div>
              <div className="text-[11px] text-white/40">No active missions.</div>
              <div className="text-[9px] text-white/25 mt-1 uppercase tracking-wider">Spawn a planet to begin</div>
            </div>
          ) : (
            <>
              {([1, 2, 3, 4, 5, 6, 7] as BullseyeRank[])
                .filter((rank) => (grouped.get(rank)?.length ?? 0) > 0)
                .map((rank) => {
                  const tasks = grouped.get(rank)!;
                  const meta = ORBIT_META[rank];
                  return (
                    <div key={rank} className="mb-2">
                      {/* Orbit group header */}
                      <div className="flex items-center gap-1.5 px-1 mb-1">
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono tracking-wider"
                          style={{ color: meta.color, backgroundColor: `${meta.color}18`, border: `1px solid ${meta.color}35` }}
                        >
                          O{rank}
                        </span>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: `${meta.color}90` }}
                        >
                          {meta.short}
                        </span>
                        <span className="text-[8px] font-mono text-white/25 ml-auto">{tasks.length}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {tasks.map((t) => (
                          <TaskRow
                            key={t.id}
                            task={t}
                            isSelected={selectedTask?.id === t.id}
                            onSelect={() => onSelectTask(t)}
                            onComplete={onCompleteTask ? () => onCompleteTask(t.id) : undefined}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
            </>
          )}

          {/* Completed section */}
          {completedTasks.length > 0 && (
            <div className="mt-2 border-t border-white/8 pt-2">
              <button
                onClick={() => setShowCompleted((v) => !v)}
                className="flex items-center gap-1.5 w-full px-1 py-0.5 text-left hover:text-white/60 transition-colors"
              >
                <span className="text-[8px] font-mono text-white/30">{showCompleted ? '▾' : '▸'}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">DONE</span>
                <span className="text-[8px] font-mono text-white/20 ml-auto">{completedTasks.length}</span>
              </button>
              {showCompleted && (
                <div className="flex flex-col gap-1 mt-1">
                  {completedTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onSelectTask(t)}
                      className={`relative px-2.5 py-1.5 rounded cursor-pointer border-l-[3px] opacity-40 hover:opacity-60 transition-all text-[10px] line-through
                        ${selectedTask?.id === t.id ? 'bg-white/10' : 'bg-white/4 hover:bg-white/7'}`}
                      style={{ borderLeftColor: t.color }}
                    >
                      <span className="text-green-400/70 mr-1">✓</span>
                      <span className="text-white/70 truncate">{t.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
