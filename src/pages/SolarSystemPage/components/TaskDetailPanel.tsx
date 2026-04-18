import { useEffect, useState } from 'react';
import MarkdownRenderer from '../../../components/MarkdownRenderer';
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

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editMode) {
          setEditMode(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [editMode, onClose]);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backdropFilter: 'blur(8px)',
        background: 'rgba(0, 0, 0, 0.3)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        {/* Minimal header - just close button */}
        <div className="flex justify-end mb-2">
          <button
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20
              backdrop-blur-sm transition-all flex items-center justify-center text-white text-xl
              hover:scale-110 hover:border-white/40"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content without card background */}
        <div className="space-y-4">
          {!editMode ? (
            <>
              {/* Task header */}
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/20
                rounded-2xl p-4 shadow-lg">
                <span
                  className="w-6 h-6 rounded-full shadow-lg"
                  style={{ backgroundColor: task.color }}
                />
                <h2 className="text-xl font-bold text-white flex-1">{task.title}</h2>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-3">
                  <div className="text-xs text-purple-300/70 mb-1">Priority</div>
                  <div className="text-sm font-semibold text-white capitalize">{task.priority}</div>
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-3">
                  <div className="text-xs text-purple-300/70 mb-1">Complexity</div>
                  <div className="text-sm font-semibold text-white">C{task.complexity}</div>
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-3">
                  <div className="text-xs text-purple-300/70 mb-1">Due Date</div>
                  <div className="text-sm font-semibold text-white">
                    {task.dueDate
                      ? new Date(task.dueDate as any).toLocaleDateString()
                      : '—'}
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-3">
                  <div className="text-xs text-purple-300/70 mb-1">Bullseye Rank</div>
                  <div className="text-sm font-semibold text-white">
                    Ring {task.rank} — {ORBIT_LABELS[task.rank]}
                  </div>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                  <div className="text-xs text-purple-300/70 mb-2 uppercase tracking-wide">Description</div>
                  <div className="text-sm text-white/90">
                    <MarkdownRenderer content={String(task.description || 'No description.')} />
                  </div>
                </div>
              )}

              {/* Subtasks */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <div className="text-xs text-purple-300/70 mb-3 uppercase tracking-wide">
                  🌙 Moons (Subtasks)
                </div>
                <div className="space-y-2">
                  {task.subtasks && task.subtasks.length > 0 ? (
                    task.subtasks.map((sub: Subtask) => (
                      <div key={sub.id} className="flex items-center gap-2 group">
                        <button
                          onClick={() => onToggleSubtask(sub.id)}
                          className={`flex-1 text-left text-sm px-3 py-2 rounded-lg transition-all
                            ${sub.completed
                              ? 'bg-green-500/20 text-green-300 line-through opacity-70'
                              : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        >
                          {sub.completed ? '☑' : '☐'} {sub.title}
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40
                            border border-red-500/30 transition-all opacity-0 group-hover:opacity-100
                            flex items-center justify-center"
                          onClick={() => onDeleteSubtask(sub.id)}
                          title="Delete moon"
                        >
                          🗑
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-white/40 italic py-2">No moons yet.</div>
                  )}

                  {/* Add new subtask */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="New moon..."
                      className="flex-1 text-sm px-3 py-2 bg-white/10 border border-white/20
                        rounded-lg text-white placeholder-white/40 focus:outline-none
                        focus:ring-2 focus:ring-purple-400/50 focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSubtask();
                        }
                      }}
                    />
                    <button
                      className="w-10 h-10 rounded-lg bg-purple-600/80 hover:bg-purple-600
                        border border-purple-400/30 transition-all flex items-center justify-center
                        hover:scale-105"
                      onClick={handleAddSubtask}
                    >
                      ➕
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="px-4 py-3 rounded-xl bg-blue-600/80 hover:bg-blue-600
                    border border-blue-400/30 text-white text-sm font-semibold
                    transition-all hover:scale-105 shadow-lg"
                  onClick={onFollowPlanet}
                >
                  📹 Follow Planet
                </button>
                <button
                  className="px-4 py-3 rounded-xl bg-purple-600/80 hover:bg-purple-600
                    border border-purple-400/30 text-white text-sm font-semibold
                    transition-all hover:scale-105 shadow-lg"
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit
                </button>
                <button
                  className={`px-4 py-3 rounded-xl border text-white text-sm font-semibold
                    transition-all hover:scale-105 shadow-lg ${
                      task.completed
                        ? 'bg-orange-600/80 hover:bg-orange-600 border-orange-400/30'
                        : 'bg-green-600/80 hover:bg-green-600 border-green-400/30'
                    }`}
                  onClick={onToggleComplete}
                >
                  {task.completed ? '↩️ Mark Incomplete' : '✅ Mark Complete'}
                </button>
                <button
                  className="px-4 py-3 rounded-xl bg-red-600/80 hover:bg-red-600
                    border border-red-400/30 text-white text-sm font-semibold
                    transition-all hover:scale-105 shadow-lg"
                  onClick={onDelete}
                >
                  🗑 Delete Planet
                </button>
              </div>
            </>
          ) : (
            /* Edit Mode */
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
