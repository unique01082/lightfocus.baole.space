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
  loading?: boolean;
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
  loading = false,
}: TaskFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block mb-1 text-xs font-semibold text-purple-300 uppercase tracking-wider">
          Task Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter task title..."
          className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200"
          autoFocus
        />
      </div>

      <div>
        <label className="block mb-1 text-xs font-semibold text-purple-300 uppercase tracking-wider">
          Description
        </label>
        <textarea
          value={desc}
          onChange={(e) => onDescChange(e.target.value)}
          placeholder="Describe the task..."
          className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200 min-h-[60px] resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-xs font-semibold text-purple-300 uppercase tracking-wider">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as Priority)}
            className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200 cursor-pointer"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="none">None</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs font-semibold text-purple-300 uppercase tracking-wider">
            Complexity (1-5)
          </label>
          <select
            value={complexity}
            onChange={(e) =>
              onComplexityChange(parseInt(e.target.value) as Complexity)
            }
            className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200 cursor-pointer"
          >
            <option value={1}>1 — Simple</option>
            <option value={2}>2 — Easy</option>
            <option value={3}>3 — Medium</option>
            <option value={4}>4 — Complex</option>
            <option value={5}>5 — Very Complex</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-xs font-semibold text-purple-300 uppercase tracking-wider">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200 cursor-pointer"
          />
        </div>
        <div>
          <label className="block mb-1 text-xs font-semibold text-purple-300 uppercase tracking-wider">
            Planet Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-10 h-9 border-none rounded cursor-pointer bg-transparent"
            />
            <span className="text-xs text-gray-400 font-mono">{color}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          className="flex-[0.5] bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? '⏳ Loading...' : submitLabel}
        </button>
      </div>
    </div>
  );
}
