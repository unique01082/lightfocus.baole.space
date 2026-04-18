import { useState } from 'react';
import type { RankedTask, Subtask } from '../../../types/task';
import TaskEditForm from './TaskEditForm';

const ORBIT_LABELS: Record<number, string> = {
  1: 'Critical',
  2: 'Very High',
  3: 'High',
  4: 'Medium',
  5: 'Low',
  6: 'Very Low',
  7: 'Minimal',
};

interface TaskDetailPanelProps {
  task: RankedTask;
  onClose: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<RankedTask>) => void;
  onToggleSubtask: (subtaskId: string) => void;
  onAddSubtask: (title: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onFollowPlanet: () => void;
}

export default function TaskDetailPanel({
  task,
  onClose,
  onToggleComplete,
  onDelete,
  onUpdate,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  onFollowPlanet,
}: TaskDetailPanelProps) {
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState((task.description as any) || '');
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editComplexity, setEditComplexity] = useState(task.complexity);
  const [editDueDate, setEditDueDate] = useState((task.dueDate as any) || '');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleSaveEdit = () => {
    onUpdate({
      title: editTitle,
      description: editDesc as any,
      priority: editPriority,
      complexity: editComplexity,
      dueDate: (editDueDate || undefined) as any,
    });
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDesc((task.description as any) || '');
    setEditPriority(task.priority);
    setEditComplexity(task.complexity);
    setEditDueDate(task.dueDate || '');
    setEditMode(false);
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onAddSubtask(newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  return (
    <div className="planet-info-card" style={{ display: 'block' }}>
      <div className="planet-info-header">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flex: 1,
          }}
        >
          <span
            className="planet-dot"
            style={{
              backgroundColor: task.color,
              width: 20,
              height: 20,
              borderRadius: '50%',
            }}
          />
          <span style={{ fontWeight: 700, fontSize: 14 }}>{task.title}</span>
        </div>
        <button className="planet-info-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="planet-info-content">
        {!editMode ? (
          <>
            <div className="info-section">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-item-label">Priority</div>
                  <div className="info-item-value">{task.priority}</div>
                </div>
                <div className="info-item">
                  <div className="info-item-label">Complexity</div>
                  <div className="info-item-value">C{task.complexity}</div>
                </div>
                <div className="info-item">
                  <div className="info-item-label">Due Date</div>
                  <div className="info-item-value">
                    {task.dueDate
                      ? new Date(task.dueDate as any).toLocaleDateString()
                      : '—'}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-item-label">Bullseye Rank</div>
                  <div className="info-item-value">
                    Ring {task.rank} — {ORBIT_LABELS[task.rank]}
                  </div>
                </div>
              </div>

              <div className="info-section">
                <div className="planet-description">{(task.description as any) || 'No description.'}</div>
              </div>
            </div>

            {/* Subtasks */}
            <div className="info-section">
              <strong style={{ fontSize: 11, color: 'var(--accent-1)' }}>MOONS (SUBTASKS)</strong>
              <div className="moons-section">
                {task.subtasks && task.subtasks.length > 0 ? (
                  task.subtasks.map((sub: Subtask) => (
                    <div key={sub.id} className="moon-item">
                      <div className="moon-info-section">
                        <div
                          onClick={() => onToggleSubtask(sub.id)}
                          style={{
                            cursor: 'pointer',
                            textDecoration: sub.completed ? 'line-through' : 'none',
                            opacity: sub.completed ? 0.5 : 1,
                            flex: 1,
                            fontSize: 11,
                          }}
                        >
                          {sub.completed ? '☑' : '☐'} {sub.title}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="icon-btn"
                          onClick={() => onDeleteSubtask(sub.id)}
                          title="Delete moon"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      fontStyle: 'italic',
                      padding: '6px 0',
                    }}
                  >
                    No moons yet.
                  </div>
                )}

                {/* Add new subtask */}
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="New moon..."
                    style={{
                      flex: 1,
                      fontSize: 11,
                      padding: '6px 8px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      color: 'var(--text-primary)',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSubtask();
                      }
                    }}
                  />
                  <button className="icon-btn" onClick={handleAddSubtask}>
                    ➕
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                marginTop: 10,
              }}
            >
              <button className="follow-planet-btn" onClick={onFollowPlanet}>
                📹 Follow Planet
              </button>
              <button className="follow-planet-btn" onClick={() => setEditMode(true)}>
                ✏️ Edit
              </button>
              <button
                className="follow-planet-btn"
                style={{
                  background: task.completed
                    ? 'var(--button-secondary)'
                    : 'var(--accent-1)',
                }}
                onClick={onToggleComplete}
              >
                {task.completed ? '↩️ Mark Incomplete' : '✅ Mark Complete'}
              </button>
              <button
                className="follow-planet-btn"
                style={{ background: 'var(--error)' }}
                onClick={onDelete}
              >
                🗑 Delete Planet
              </button>
            </div>
          </>
        ) : (
          /* Edit Mode */
          <TaskEditForm
            editTitle={editTitle}
            editDesc={editDesc}
            editPriority={editPriority}
            editComplexity={editComplexity as any}
            editDueDate={editDueDate}
            setEditTitle={setEditTitle}
            setEditDesc={setEditDesc}
            setEditPriority={setEditPriority}
            setEditComplexity={setEditComplexity}
            setEditDueDate={setEditDueDate}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    </div>
  );
}
