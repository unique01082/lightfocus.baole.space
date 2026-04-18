import { Button, Input, Select, Textarea } from '../../../components/ui';
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
    <div className="flex flex-col gap-3">
      <Input
        label="TITLE"
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
      />

      <Textarea
        label="DESCRIPTION"
        value={editDesc}
        onChange={(e) => setEditDesc(e.target.value)}
        rows={3}
      />

      <div className="grid grid-cols-2 gap-2.5">
        <Select
          label="PRIORITY"
          value={editPriority}
          onChange={(e) => setEditPriority(e.target.value as Priority)}
        >
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="none">None</option>
        </Select>

        <Select
          label="COMPLEXITY"
          value={editComplexity}
          onChange={(e) => setEditComplexity(parseInt(e.target.value) as Complexity)}
        >
          <option value={1}>1 — Simple</option>
          <option value={2}>2 — Easy</option>
          <option value={3}>3 — Medium</option>
          <option value={4}>4 — Complex</option>
          <option value={5}>5 — Very Complex</option>
        </Select>
      </div>

      <Input
        label="DUE DATE"
        type="date"
        value={editDueDate}
        onChange={(e) => setEditDueDate(e.target.value)}
      />

      <div className="flex gap-1.5 mt-1.5">
        <Button variant="secondary" size="sm" onClick={onCancel} fullWidth>
          ✖ Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={onSave} fullWidth>
          💾 Save
        </Button>
      </div>
    </div>
  );
}
