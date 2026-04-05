import { useState } from 'react';
import { Link } from 'react-router';
import type { Task, Priority, Complexity, BullseyeRank } from '../types/task';
import { loadTasks, saveTasks, createTask, createSubtask, getRandomColor } from '../stores/taskStore';
import { rankTasks } from '../utils/ranking';

const ORBIT_LABELS: Record<BullseyeRank, string> = {
  1: 'Critical', 2: 'Very High', 3: 'High', 4: 'Medium',
  5: 'Low', 6: 'Very Low', 7: 'Minimal',
};

const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#e63946',
  high: '#f77f00',
  medium: '#ffd60a',
  low: '#2a9d8f',
  none: '#6c757d',
};

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'priority' | 'dueDate' | 'created'>('rank');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPriority, setFormPriority] = useState<Priority>('medium');
  const [formComplexity, setFormComplexity] = useState<Complexity>(3);
  const [formDueDate, setFormDueDate] = useState('');
  const [formColor, setFormColor] = useState(getRandomColor());

  const ranked = rankTasks(tasks);
  const filtered = ranked.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'rank': return a.rank - b.rank;
      case 'priority': {
        const ord: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3, none: 4 };
        return ord[a.priority] - ord[b.priority];
      }
      case 'dueDate': {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      case 'created': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return 0;
    }
  });

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const handleCreate = () => {
    if (!formTitle.trim()) return;
    const task = createTask({
      title: formTitle.trim(),
      description: formDesc.trim(),
      priority: formPriority,
      complexity: formComplexity,
      dueDate: formDueDate || null,
      color: formColor,
    });
    updateTasks([...tasks, task]);
    setFormTitle('');
    setFormDesc('');
    setFormPriority('medium');
    setFormComplexity(3);
    setFormDueDate('');
    setFormColor(getRandomColor());
    setShowCreateForm(false);
  };

  const handleToggleComplete = (id: string) => {
    updateTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t));
  };

  const handleDelete = (id: string) => {
    updateTasks(tasks.filter(t => t.id !== id));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    updateTasks(tasks.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s),
        updatedAt: new Date().toISOString(),
      };
    }));
  };

  const handleAddSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    updateTasks(tasks.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: [...t.subtasks, createSubtask(title.trim())], updatedAt: new Date().toISOString() };
    }));
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="tasklist-header">
          <div>
            <h1 className="page-title">Task List</h1>
            <p className="page-subtitle">
              {activeTasks.length} active · {completedCount} completed · {tasks.reduce((s, t) => s + t.subtasks.length, 0)} subtasks
            </p>
          </div>
          <div className="tasklist-actions">
            <Link to="/" className="glass-btn">🪐 Solar System</Link>
            <button className="accent-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? '✕ Cancel' : '➕ New Task'}
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="glass-card create-form">
            <h3>Create New Task</h3>
            <div className="form-grid">
              <div className="form-field full-width">
                <label>Title</label>
                <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Task title..." autoFocus />
              </div>
              <div className="form-field full-width">
                <label>Description</label>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Describe the task..." rows={2} />
              </div>
              <div className="form-field">
                <label>Priority</label>
                <select value={formPriority} onChange={e => setFormPriority(e.target.value as Priority)}>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="form-field">
                <label>Complexity</label>
                <select value={formComplexity} onChange={e => setFormComplexity(parseInt(e.target.value) as Complexity)}>
                  <option value={1}>1 — Simple</option>
                  <option value={2}>2 — Easy</option>
                  <option value={3}>3 — Medium</option>
                  <option value={4}>4 — Complex</option>
                  <option value={5}>5 — Very Complex</option>
                </select>
              </div>
              <div className="form-field">
                <label>Due Date</label>
                <input type="date" value={formDueDate} onChange={e => setFormDueDate(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={formColor} onChange={e => setFormColor(e.target.value)} style={{ width: 36, height: 32, border: 'none', borderRadius: 4, cursor: 'pointer' }} />
                  <span style={{ fontSize: 12, opacity: 0.6 }}>{formColor}</span>
                </div>
              </div>
            </div>
            <button className="accent-btn" onClick={handleCreate} style={{ marginTop: 16 }}>🚀 Create Task</button>
          </div>
        )}

        {/* Filters */}
        <div className="tasklist-filters">
          <div className="filter-group">
            {(['all', 'active', 'completed'] as const).map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <label style={{ fontSize: 12, opacity: 0.6 }}>Sort by:</label>
            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
              <option value="rank">Bullseye Rank</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="created">Recently Created</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <div className="tasklist-items">
          {sorted.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <div className="task-card-header">
                <div className="task-card-left">
                  <button
                    className="task-check"
                    onClick={() => handleToggleComplete(task.id)}
                    style={{ borderColor: task.color }}
                  >
                    {task.completed && '✓'}
                  </button>
                  <div>
                    <div className="task-card-title" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      <span className="planet-dot" style={{ backgroundColor: task.color }} />
                      {task.title}
                    </div>
                    {task.description && <div className="task-card-desc">{task.description}</div>}
                  </div>
                </div>
                <div className="task-card-right">
                  <span className="rank-badge" style={{ background: `linear-gradient(135deg, ${task.color}, ${task.color}88)` }}>
                    Ring {task.rank}
                  </span>
                  <span className="priority-pill" style={{ backgroundColor: PRIORITY_COLORS[task.priority] + '33', color: PRIORITY_COLORS[task.priority] }}>
                    {task.priority}
                  </span>
                  <button className="delete-btn" onClick={() => handleDelete(task.id)} title="Delete task">🗑</button>
                </div>
              </div>

              <div className="task-card-meta">
                <span>🧩 C{task.complexity}</span>
                {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                <span>🌙 {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks</span>
                <span>{ORBIT_LABELS[task.rank]}</span>
              </div>

              {task.subtasks.length > 0 && (
                <div className="subtask-list">
                  {task.subtasks.map(sub => (
                    <div key={sub.id} className="subtask-item">
                      <button
                        className={`subtask-check ${sub.completed ? 'done' : ''}`}
                        onClick={() => handleToggleSubtask(task.id, sub.id)}
                      >
                        {sub.completed ? '✓' : ''}
                      </button>
                      <span style={{ textDecoration: sub.completed ? 'line-through' : 'none', opacity: sub.completed ? 0.5 : 1 }}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <SubtaskAdder taskId={task.id} onAdd={handleAddSubtask} />
            </div>
          ))}

          {sorted.length === 0 && (
            <div className="empty-state">
              <p className="empty-icon">🪐</p>
              <p>No tasks found.</p>
              <button className="accent-btn" onClick={() => setShowCreateForm(true)}>Create your first task</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SubtaskAdder({ taskId, onAdd }: { taskId: string; onAdd: (taskId: string, title: string) => void }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button className="add-subtask-btn" onClick={() => setOpen(true)}>+ Add subtask</button>
    );
  }

  return (
    <div className="subtask-adder">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Subtask title..."
        autoFocus
        onKeyDown={e => {
          if (e.key === 'Enter' && title.trim()) {
            onAdd(taskId, title);
            setTitle('');
          }
          if (e.key === 'Escape') { setOpen(false); setTitle(''); }
        }}
      />
      <button className="accent-btn-sm" onClick={() => { if (title.trim()) { onAdd(taskId, title); setTitle(''); } }}>
        Add
      </button>
      <button className="ghost-btn-sm" onClick={() => { setOpen(false); setTitle(''); }}>
        Cancel
      </button>
    </div>
  );
}
