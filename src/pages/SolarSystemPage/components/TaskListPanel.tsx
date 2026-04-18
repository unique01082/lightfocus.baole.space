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
  const grouped = groupByOrbit(rankedTasks);
  const activeByRank = rankedTasks.filter((t) => !t.completed);
  const completedTasks = rankedTasks.filter((t) => t.completed);

  return (
    <Panel
      className={`${uiHidden ? 'ui-hidden' : ''} w-[260px] max-h-[calc(100vh-100px)] overflow-y-auto`}
      style={{ top: 20, right: 20 }}
    >
      <div className="px-2 py-2 bg-gradient-to-br from-accent-1 to-accent-2 border-b border-panel -m-0 mb-4 rounded-t-lg">
        <h3 className="m-0 font-space font-bold text-[11px] text-white uppercase tracking-widest">
          CELESTIAL BODIES
        </h3>
      </div>

      <div className="px-2 pb-2">
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
                              rounded
                              text-[11px]
                              cursor-pointer
                              border-l-[3px]
                              transition-all
                              duration-200
                              ${isSelected
                                ? 'bg-white/15'
                                : 'bg-white/5 hover:bg-white/10'
                              }
                            `}
                            style={{ borderLeftColor: t.color }}
                          >
                            <div className="font-semibold mb-0.5">{t.title}</div>
                            <div className="text-[9px] text-text-muted flex gap-2">
                              <span className="uppercase">{t.priority}</span>
                              <span>C{t.complexity}</span>
                              {t.subtasks && t.subtasks.length > 0 && (
                                <span>
                                  🌙{' '}
                                  {t.subtasks.filter((s) => s.completed).length}/
                                  {t.subtasks.length}
                                </span>
                              )}
                            </div>
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
            <div className="flex flex-col gap-1.5 pl-4">
              {completedTasks.map((t) => {
                const isSelected = selectedTask?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className={`
                      px-2.5 py-1.5
                      rounded
                      text-[11px]
                      cursor-pointer
                      border-l-[3px]
                      opacity-60
                      line-through
                      ${isSelected
                        ? 'bg-white/15'
                        : 'bg-white/5 hover:bg-white/10'
                      }
                    `}
                    style={{ borderLeftColor: t.color }}
                  >
                    {t.title}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
