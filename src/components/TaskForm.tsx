import type { Complexity, Priority } from "../types/task";

interface TaskFormProps {
  title: string;
  desc: string;
  priority: Priority;
  complexity: Complexity;
  dueDate: string;
  color: string;
  onTitleChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onPriorityChange: (v: Priority) => void;
  onComplexityChange: (v: Complexity) => void;
  onDueDateChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

export default function TaskForm({
  title,
  desc,
  priority,
  complexity,
  dueDate,
  color,
  onTitleChange,
  onDescChange,
  onPriorityChange,
  onComplexityChange,
  onDueDateChange,
  onColorChange,
  onSubmit,
  onCancel,
  submitLabel,
}: TaskFormProps) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 6,
    padding: "8px 12px",
    color: "var(--text-primary)",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 13,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 4,
    fontSize: 11,
    color: "var(--accent-1)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "'Space Grotesk', sans-serif",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={labelStyle}>Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter task title..."
          style={inputStyle}
          autoFocus
        />
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={desc}
          onChange={(e) => onDescChange(e.target.value)}
          placeholder="Describe the task..."
          style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Priority</label>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as Priority)}
            style={inputStyle}
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="none">None</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Complexity (1-5)</label>
          <select
            value={complexity}
            onChange={(e) =>
              onComplexityChange(parseInt(e.target.value) as Complexity)
            }
            style={inputStyle}
          >
            <option value={1}>1 — Simple</option>
            <option value={2}>2 — Easy</option>
            <option value={3}>3 — Medium</option>
            <option value={4}>4 — Complex</option>
            <option value={5}>5 — Very Complex</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Planet Color</label>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              style={{
                width: 40,
                height: 34,
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {color}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button
          className="follow-planet-btn"
          style={{ flex: 1 }}
          onClick={onSubmit}
        >
          {submitLabel}
        </button>
        <button
          className="follow-planet-btn"
          style={{ flex: 0.5, background: "var(--button-secondary)" }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
