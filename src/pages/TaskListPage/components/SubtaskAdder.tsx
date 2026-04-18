import { useToggle } from 'ahooks';
import { useState } from 'react';

interface SubtaskAdderProps {
  taskId: string;
  onAdd: (taskId: string, title: string) => void;
}

export default function SubtaskAdder({ taskId, onAdd }: SubtaskAdderProps) {
  const [title, setTitle] = useState('');
  const [open, { setRight: openForm, setLeft: closeForm }] = useToggle(false);

  const resetForm = () => {
    setTitle('');
    closeForm();
  };

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(taskId, title);
      setTitle('');
    }
  };

  if (!open) {
    return (
      <button className="add-subtask-btn" onClick={openForm}>
        + Add subtask
      </button>
    );
  }

  return (
    <div className="subtask-adder">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Subtask title..."
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && title.trim()) {
            handleAdd();
          }
          if (e.key === 'Escape') {
            resetForm();
          }
        }}
      />
      <button className="accent-btn-sm" onClick={handleAdd}>
        Add
      </button>
      <button className="ghost-btn-sm" onClick={resetForm}>
        Cancel
      </button>
    </div>
  );
}
