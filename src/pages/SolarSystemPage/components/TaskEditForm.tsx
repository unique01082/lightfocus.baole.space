import type { Complexity, Priority } from '../../../types/task';

interface TaskEditFormProps {
  editTitle: string;
  editDesc: string;
  editPriority: Priority;
  editComplexity: Complexity;
  editDueDate: string;
  setEditTitle: (value: string) => void;
  setEditDesc: (value: string) => void;
  setEditPriority: (value: Priority) => void;
  setEditComplexity: (value: Complexity) => void;
  setEditDueDate: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function TaskEditForm({
  editTitle,
  editDesc,
  editPriority,
  editComplexity,
  editDueDate,
  setEditTitle,
  setEditDesc,
  setEditPriority,
  setEditComplexity,
  setEditDueDate,
  onSave,
  onCancel,
}: TaskEditFormProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ fontSize: 10, color: 'var(--accent-1)', display: 'block', marginBottom: 4 }}>
          TITLE
        </label>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          style={{
            width: '100%',
            fontSize: 11,
            padding: '6px 8px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            color: 'var(--text-primary)',
          }}
        />
      </div>
      <div>
        <label style={{ fontSize: 10, color: 'var(--accent-1)', display: 'block', marginBottom: 4 }}>
          DESCRIPTION
        </label>
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          style={{
            width: '100%',
            fontSize: 11,
            padding: '6px 8px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            color: 'var(--text-primary)',
            minHeight: 60,
            resize: 'vertical',
          }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ fontSize: 10, color: 'var(--accent-1)', display: 'block', marginBottom: 4 }}>
            PRIORITY
          </label>
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Priority)}
            style={{
              width: '100%',
              fontSize: 11,
              padding: '6px 8px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              color: 'var(--text-primary)',
            }}
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="none">None</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 10, color: 'var(--accent-1)', display: 'block', marginBottom: 4 }}>
            COMPLEXITY
          </label>
          <select
            value={editComplexity}
            onChange={(e) => setEditComplexity(parseInt(e.target.value) as Complexity)}
            style={{
              width: '100%',
              fontSize: 11,
              padding: '6px 8px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              color: 'var(--text-primary)',
            }}
          >
            <option value={1}>1 — Simple</option>
            <option value={2}>2 — Easy</option>
            <option value={3}>3 — Medium</option>
            <option value={4}>4 — Complex</option>
            <option value={5}>5 — Very Complex</option>
          </select>
        </div>
      </div>
      <div>
        <label style={{ fontSize: 10, color: 'var(--accent-1)', display: 'block', marginBottom: 4 }}>
          DUE DATE
        </label>
        <input
          type="date"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
          style={{
            width: '100%',
            fontSize: 11,
            padding: '6px 8px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            color: 'var(--text-primary)',
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
        <button className="follow-planet-btn" style={{ flex: 1 }} onClick={onSave}>
          💾 Save
        </button>
        <button
          className="follow-planet-btn"
          style={{ flex: 1, background: 'var(--button-secondary)' }}
          onClick={onCancel}
        >
          ✖ Cancel
        </button>
      </div>
    </div>
  );
}
