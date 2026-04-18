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
      <button
        className="text-purple-300 hover:text-purple-200 text-sm font-semibold py-2 px-3 rounded-lg border border-purple-400/30 hover:bg-purple-500/20 transition-all duration-200"
        onClick={openForm}
      >
        + Add subtask
      </button>
    );
  }

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Subtask title..."
        autoFocus
        className="flex-1 bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && title.trim()) {
            handleAdd();
          }
          if (e.key === 'Escape') {
            resetForm();
          }
        }}
      />
      <button
        className="bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300"
        onClick={resetForm}
      >
        Cancel
      </button>
      <button
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
}
