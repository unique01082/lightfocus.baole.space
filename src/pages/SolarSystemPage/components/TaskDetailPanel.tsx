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
        backdropFilter: 'blur(12px)',
        background: 'rgba(0, 0, 0, 0.5)',
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
        {/* HUD-style header with close button */}
        <div className="flex justify-end mb-2">
          <button
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600/80 to-red-800/80 hover:from-red-500 hover:to-red-700 border-2 border-red-400/50
              backdrop-blur-sm transition-all flex items-center justify-center text-white text-xl
              hover:scale-110 hover:border-red-300/70 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] relative
              before:absolute before:inset-0 before:rounded-lg before:border before:border-white/20"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content without card background */}
        <div className="space-y-4">
          {!editMode ? (
            <>
              {/* Task header - HUD style */}
              <div className="flex items-center gap-3 bg-gradient-to-br from-indigo-950/90 to-purple-950/90 backdrop-blur-xl border-2 border-cyan-400/50
                rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.4)] relative">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
                <span
                  className="w-6 h-6 rounded-full shadow-[0_0_15px] animate-pulse"
                  style={{ backgroundColor: task.color, boxShadow: `0 0 15px ${task.color}` }}
                />
                <h2 className="text-xl font-bold text-white flex-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">{task.title}</h2>
              </div>

              {/* Info grid - HUD style */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-lg p-3 hover:border-cyan-400/60 transition-all relative group">
                  <div className="text-[10px] text-cyan-300/70 mb-1 uppercase tracking-wider">Priority</div>
                  <div className="text-sm font-bold text-white capitalize drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]">{task.priority}</div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400/50 rounded-full group-hover:bg-cyan-400 transition-colors" />
                </div>
                <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-lg p-3 hover:border-cyan-400/60 transition-all relative group">
                  <div className="text-[10px] text-cyan-300/70 mb-1 uppercase tracking-wider">Complexity</div>
                  <div className="text-sm font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]">C{task.complexity}</div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400/50 rounded-full group-hover:bg-cyan-400 transition-colors" />
                </div>
                <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-lg p-3 hover:border-cyan-400/60 transition-all relative group">
                  <div className="text-[10px] text-cyan-300/70 mb-1 uppercase tracking-wider">Due Date</div>
                  <div className="text-sm font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]">
                    {task.dueDate
                      ? new Date(task.dueDate as any).toLocaleDateString()
                      : '—'}
                  </div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400/50 rounded-full group-hover:bg-cyan-400 transition-colors" />
                </div>
                <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-lg p-3 hover:border-cyan-400/60 transition-all relative group">
                  <div className="text-[10px] text-cyan-300/70 mb-1 uppercase tracking-wider">Bullseye Rank</div>
                  <div className="text-sm font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]">
                    Ring {task.rank} — {ORBIT_LABELS[task.rank]}
                  </div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400/50 rounded-full group-hover:bg-cyan-400 transition-colors" />
                </div>
              </div>

              {/* Description - HUD style */}
              {task.description && (
                <div className="bg-black/60 backdrop-blur-xl border border-purple-400/30 rounded-lg p-4 relative">
                  <div className="absolute top-0 left-3 -translate-y-1/2 px-2 bg-black/80 border border-purple-400/50 rounded">
                    <span className="text-[10px] text-purple-300 uppercase tracking-wider font-bold">Description</span>
                  </div>
                  <div className="text-sm text-white/90 mt-2">
                    <MarkdownRenderer content={String(task.description || 'No description.')} />
                  </div>
                </div>
              )}

              {/* Subtasks - HUD style */}
              <div className="bg-black/60 backdrop-blur-xl border border-purple-400/30 rounded-lg p-4 relative">
                <div className="absolute top-0 left-3 -translate-y-1/2 px-2 bg-black/80 border border-purple-400/50 rounded flex items-center gap-1">
                  <span className="text-[10px] text-purple-300 uppercase tracking-wider font-bold">🌙 Moons (Subtasks)</span>
                </div>
                <div className="space-y-2 mt-3">
                  {task.subtasks && task.subtasks.length > 0 ? (
                    task.subtasks.map((sub: Subtask) => (
                      <div key={sub.id} className="flex items-center gap-2 group">
                        <button
                          onClick={() => onToggleSubtask(sub.id)}
                          className={`flex-1 text-left text-sm px-3 py-2 rounded-lg transition-all border relative
                            ${sub.completed
                              ? 'bg-green-500/20 text-green-300 line-through opacity-70 border-green-500/30'
                              : 'bg-white/5 text-white hover:bg-white/10 border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                            }`}
                        >
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-400/60 rounded-r" />
                          <span className="ml-2">{sub.completed ? '☑' : '☐'} {sub.title}</span>
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/60
                            border border-red-500/40 hover:border-red-400 transition-all opacity-0 group-hover:opacity-100
                            flex items-center justify-center hover:shadow-[0_0_8px_rgba(239,68,68,0.4)]"
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

                  {/* Add new subtask - HUD style */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gradient-to-r from-transparent via-cyan-400/30 to-transparent">
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="New moon..."
                      className="flex-1 text-sm px-3 py-2 bg-black/40 border border-cyan-400/30
                        rounded-lg text-white placeholder-cyan-200/40 focus:outline-none
                        focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/70
                        hover:border-cyan-400/50 transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSubtask();
                        }
                      }}
                    />
                    <button
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500
                        border border-purple-400/50 transition-all flex items-center justify-center
                        hover:scale-105 hover:shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                      onClick={handleAddSubtask}
                    >
                      ➕
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions - HUD style */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="px-4 py-3 rounded-lg bg-gradient-to-br from-blue-600/80 to-cyan-600/80 hover:from-blue-500 hover:to-cyan-500
                    border-2 border-blue-400/50 hover:border-blue-300/70 text-white text-sm font-bold uppercase tracking-wide
                    transition-all hover:scale-105 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] relative
                    before:absolute before:inset-0 before:rounded-lg before:border before:border-white/20"
                  onClick={onFollowPlanet}
                >
                  📹 Follow
                </button>
                <button
                  className="px-4 py-3 rounded-lg bg-gradient-to-br from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500
                    border-2 border-purple-400/50 hover:border-purple-300/70 text-white text-sm font-bold uppercase tracking-wide
                    transition-all hover:scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] relative
                    before:absolute before:inset-0 before:rounded-lg before:border before:border-white/20"
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit
                </button>
                <button
                  className={`px-4 py-3 rounded-lg border-2 text-white text-sm font-bold uppercase tracking-wide
                    transition-all hover:scale-105 relative
                    before:absolute before:inset-0 before:rounded-lg before:border before:border-white/20 ${
                      task.completed
                        ? 'bg-gradient-to-br from-orange-600/80 to-red-600/80 hover:from-orange-500 hover:to-red-500 border-orange-400/50 hover:border-orange-300/70 shadow-[0_0_15px_rgba(251,146,60,0.5)] hover:shadow-[0_0_20px_rgba(251,146,60,0.7)]'
                        : 'bg-gradient-to-br from-green-600/80 to-emerald-600/80 hover:from-green-500 hover:to-emerald-500 border-green-400/50 hover:border-green-300/70 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]'
                    }`}
                  onClick={onToggleComplete}
                >
                  {task.completed ? '↩️ Reopen' : '✅ Complete'}
                </button>
                <button
                  className="px-4 py-3 rounded-lg bg-gradient-to-br from-red-600/80 to-rose-600/80 hover:from-red-500 hover:to-rose-500
                    border-2 border-red-400/50 hover:border-red-300/70 text-white text-sm font-bold uppercase tracking-wide
                    transition-all hover:scale-105 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] relative
                    before:absolute before:inset-0 before:rounded-lg before:border before:border-white/20"
                  onClick={onDelete}
                >
                  🗑 Delete
                </button>
              </div>
            </>
          ) : (
            /* Edit Mode - HUD style */
            <div className="bg-gradient-to-br from-indigo-950/90 to-purple-950/90 backdrop-blur-xl border-2 border-cyan-400/50 rounded-xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.4)] relative">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-300" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-300" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-300" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-300" />
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
