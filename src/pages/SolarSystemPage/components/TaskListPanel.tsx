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

  return (
    <div
      className={`celestial-panel ${uiHidden ? 'ui-hidden' : ''}`}
      style={{
        top: 20,
        right: 20,
        width: 260,
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
      }}
    >
      <div
        className="panel-header"
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--accent-1)',
          letterSpacing: 1,
          marginBottom: 15,
        }}
      >
        🌌 CELESTIAL BODIES
      </div>
      <div className="celestial-content">
        <div className="celestial-controls">
          <button
            className="follow-planet-btn"
            style={{
              padding: '6px 10px',
              fontSize: 11,
              background: selectedTask
                ? 'var(--button-secondary)'
                : 'transparent',
            }}
            onClick={() => onSelectTask(null)}
          >
            {selectedTask ? '✖ Deselect' : 'No selection'}
          </button>
        </div>

        {activeByRank.length === 0 ? (
          <div
            style={{
              padding: '40px 15px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 12,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>🌠</div>
            <div>No active tasks.</div>
            <div style={{ fontSize: 10, marginTop: 4 }}>
              Create a new planet to get started!
            </div>
          </div>
        ) : (
          <>
            {([1, 2, 3, 4, 5, 6, 7] as BullseyeRank[])
              .filter((rank) => grouped[rank]?.length > 0)
              .map((rank) => {
                return (
                  <div key={rank}>
                    <div className="category-header">
                      <span style={{ color: grouped[rank][0].color }}>⬤</span>{' '}
                      {ORBIT_LABELS[rank]}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        paddingLeft: 16,
                      }}
                    >
                      {grouped[rank].map((t) => {
                        const isSelected = selectedTask?.id === t.id;
                        return (
                          <div
                            key={t.id}
                            onClick={() => onSelectTask(t)}
                            style={{
                              padding: '6px 10px',
                              background: isSelected
                                ? 'rgba(255,255,255,0.15)'
                                : 'rgba(255,255,255,0.05)',
                              borderRadius: 4,
                              fontSize: 11,
                              cursor: 'pointer',
                              borderLeft: `3px solid ${t.color}`,
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.background =
                                  'rgba(255,255,255,0.1)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.background =
                                  'rgba(255,255,255,0.05)';
                              }
                            }}
                          >
                            <div style={{ fontWeight: 600, marginBottom: 2 }}>
                              {t.title}
                            </div>
                            <div
                              style={{
                                fontSize: 9,
                                color: 'var(--text-muted)',
                                display: 'flex',
                                gap: 8,
                              }}
                            >
                              <span>{t.priority}</span>
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
        {grouped.completed && grouped.completed.length > 0 && (
          <div>
            <div className="category-header">
              <span style={{ color: '#4a9' }}>✓</span> Completed
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                paddingLeft: 16,
              }}
            >
              {grouped.completed.map((t) => {
                const isSelected = selectedTask?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    style={{
                      padding: '6px 10px',
                      background: isSelected
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.05)',
                      borderRadius: 4,
                      fontSize: 11,
                      cursor: 'pointer',
                      borderLeft: `3px solid ${t.color}`,
                      opacity: 0.6,
                      textDecoration: 'line-through',
                    }}
                  >
                    {t.title}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeByRank.length === 0 && (
          <div style={{ padding: '15px', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: 11 }}>No active tasks.</div>
          </div>
        )}
      </div>
    </div>
  );
}
