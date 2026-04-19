import { useState } from 'react';
import { Button, Panel, Tag } from '../../../components/ui';
import type { BullseyeRank, RankedTask } from '../../../types/task';
import { groupByOrbit } from '../../../utils/ranking';

const ORBIT_LABELS: Record<BullseyeRank, string> = {
  1: 'Critical',
  2: 'Very High',
  3: 'High',
  4: 'Medium',
  5: 'Low',
  6: 'Very Low',
  7: 'Minimal',
};

interface TaskListPanelProps {
  uiHidden: boolean;
  rankedTasks: RankedTask[];
  selectedTask: RankedTask | null;
  onSelectTask: (task: RankedTask | null) => void;
}

export default function TaskListPanel({
  uiHidden,
  rankedTasks,
  selectedTask,
  onSelectTask,
}: TaskListPanelProps) {
  const [minimized, setMinimized] = useState(false);
  const grouped = groupByOrbit(rankedTasks);
  const activeByRank = rankedTasks.filter((t) => !t.completed);
  const completedTasks = rankedTasks.filter((t) => t.completed);

  return (
    <Panel
      className={`${uiHidden ? 'ui-hidden' : ''} ${minimized ? 'w-auto' : 'w-[260px]'} ${minimized ? 'max-h-auto' : 'max-h-[60vh] overflow-hidden'} transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]`}
      style={{ top: 20, right: 20 }}
    >
      <div
        className={`px-3 py-2 bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-b border-purple-400/40 -m-0 ${minimized ? '' : 'mb-4'} rounded-t-lg cursor-pointer hover:bg-purple-500/30 transition-all flex items-center justify-between group`}
        onClick={() => setMinimized(!minimized)}
      >
        {/* Glowing line effect */}
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60" />
        <div className="flex items-center gap-2">
          <span className="text-purple-400 text-sm animate-pulse">◆</span>
          <h3 className="m-0 font-space font-bold text-[11px] text-purple-100 uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
            CELESTIAL BODIES
          </h3>
        </div>
        <span className="text-purple-300 text-xs group-hover:text-purple-100 transition-colors">{minimized ? '▼' : '▲'}</span>
      </div>

      {!minimized && (
        <div className="px-2 pb-2 max-h-[calc(60vh-4rem)] overflow-y-auto pr-1 scrollbar-thin">
          <div className="mb-3">
            <Button
              size="sm"
              variant={selectedTask ? 'secondary' : 'ghost'}
              onClick={() => onSelectTask(null)}
              fullWidth
            >
              {selectedTask ? '✖ Deselect' : 'No selection'}
            </Button>
          </div>

          {activeByRank.length === 0 ? (
            <div className="py-10 px-4 text-center text-text-muted text-xs">
              <div className="text-3xl mb-2">🌠</div>
              <div className="text-sm">No active tasks.</div>
              <div className="text-[10px] mt-1">
                Create a new planet to get started!
              </div>
            </div>
          ) : (
            <>
              {([1, 2, 3, 4, 5, 6, 7] as BullseyeRank[])
                .filter((rank) => grouped.get(rank)!.length > 0)
                .map((rank) => {
                  return (
                    <div key={rank} className="mb-4">
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                        <Tag color={grouped.get(rank)![0].color} size="sm">
                          {ORBIT_LABELS[rank]}
                        </Tag>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {grouped.get(rank)!.map((t) => {
                          const isSelected = selectedTask?.id === t.id;
                          return (
                            <div
                              key={t.id}
                              onClick={() => onSelectTask(t)}
                              className={`
                                px-2.5 py-1.5
                                rounded-md
                                text-[11px]
                                cursor-pointer
                                border-l-[3px]
                                transition-all
                                duration-200
                                relative
                                hover:shadow-[0_0_8px_rgba(34,211,238,0.2)]
                                ${isSelected
                                  ? 'bg-white/15 border-opacity-100 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                                  : 'bg-white/5 hover:bg-white/10 border-opacity-60'
                                }
                              `}
                              style={{ borderLeftColor: t.color }}
                            >
                              <div className="font-bold mb-0.5 drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">{t.title}</div>
                              <div className="text-[9px] text-cyan-200/70 flex gap-2">
                                <span className="uppercase font-semibold">{t.priority}</span>
                                <span className="text-purple-300/80">C{t.complexity}</span>
                                {t.subtasks && t.subtasks.length > 0 && (
                                  <span className="text-pink-300/80">
                                    🌙{' '}
                                    {t.subtasks.filter((s) => s.completed).length}/
                                    {t.subtasks.length}
                                  </span>
                                )}
                              </div>
                              {isSelected && (
                                <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-1 h-3/4 bg-cyan-400 rounded-l" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </>
          )}

          {/* Completed section */}
          {completedTasks.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                <Tag color="#4a9" size="sm">
                  Completed
                </Tag>
              </div>
              <div className="flex flex-col gap-1.5">
                {completedTasks.map((t) => {
                  const isSelected = selectedTask?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => onSelectTask(t)}
                      className={`
                        px-2.5 py-1.5
                        rounded-md
                        text-[11px]
                        cursor-pointer
                        border-l-[3px]
                        opacity-50
                        line-through
                        hover:opacity-70
                        transition-all
                        relative
                        ${isSelected
                          ? 'bg-white/15 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                          : 'bg-white/5 hover:bg-white/10'
                        }
                      `}
                      style={{ borderLeftColor: t.color }}
                    >
                      <span className="text-green-400/70">✓</span> {t.title}
                      {isSelected && (
                        <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-1 h-3/4 bg-cyan-400/50 rounded-l" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
