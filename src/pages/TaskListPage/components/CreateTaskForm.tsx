import type { Complexity, Priority } from '../../../types/task';

interface CreateTaskFormProps {
  formTitle: string;
  formDesc: string;
  formPriority: Priority;
  formComplexity: Complexity;
  formDueDate: string;
  formColor: string;
  setFormTitle: (value: string) => void;
  setFormDesc: (value: string) => void;
  setFormPriority: (value: Priority) => void;
  setFormComplexity: (value: Complexity) => void;
  setFormDueDate: (value: string) => void;
  setFormColor: (value: string) => void;
  onSubmit: () => void;
  creating: boolean;
}

export default function CreateTaskForm({
  formTitle,
  formDesc,
  formPriority,
  formComplexity,
  formDueDate,
  formColor,
  setFormTitle,
  setFormDesc,
  setFormPriority,
  setFormComplexity,
  setFormDueDate,
  setFormColor,
  onSubmit,
  creating,
}: CreateTaskFormProps) {
  return (
    <div className="glass-card create-form">
      <h3>Create New Task</h3>
      <div className="form-grid">
        <div className="form-field full-width">
          <label>Title</label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Task title..."
            autoFocus
          />
        </div>
        <div className="form-field full-width">
          <label>Description</label>
          <textarea
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder="Describe the task..."
            rows={2}
          />
        </div>
        <div className="form-field">
          <label>Priority</label>
          <select
            value={formPriority}
            onChange={(e) => setFormPriority(e.target.value as Priority)}
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="none">None</option>
          </select>
        </div>
        <div className="form-field">
          <label>Complexity</label>
          <select
            value={formComplexity}
            onChange={(e) =>
              setFormComplexity(parseInt(e.target.value) as Complexity)
            }
          >
            <option value={1}>1 — Simple</option>
            <option value={2}>2 — Easy</option>
            <option value={3}>3 — Medium</option>
            <option value={4}>4 — Complex</option>
            <option value={5}>5 — Very Complex</option>
          </select>
        </div>
        <div className="form-field">
          <label>Due Date</label>
          <input
            type="date"
            value={formDueDate}
            onChange={(e) => setFormDueDate(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Color</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="color"
              value={formColor}
              onChange={(e) => setFormColor(e.target.value)}
              style={{
                width: 36,
                height: 32,
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: 12, opacity: 0.6 }}>{formColor}</span>
          </div>
        </div>
      </div>
      <button
        className="accent-btn"
        onClick={onSubmit}
        style={{ marginTop: 16 }}
        disabled={creating}
      >
        {creating ? '⏳ Creating...' : '🚀 Create Task'}
      </button>
    </div>
  );
}
