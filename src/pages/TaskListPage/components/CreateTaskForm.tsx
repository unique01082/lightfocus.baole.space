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
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-xl shadow-purple-500/10 mb-6">
      <h3 className="text-2xl font-bold text-purple-200 mb-6 flex items-center gap-2">
        <span>✨</span> Create New Task
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">Title</label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Task title..."
            autoFocus
            className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">Description</label>
          <textarea
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder="Describe the task..."
            rows={2}
            className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">Priority</label>
          <select
            value={formPriority}
            onChange={(e) => setFormPriority(e.target.value as Priority)}
            className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="none">None</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">Complexity</label>
          <select
            value={formComplexity}
            onChange={(e) =>
              setFormComplexity(parseInt(e.target.value) as Complexity)
            }
            className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200"
          >
            <option value={1}>1 — Simple</option>
            <option value={2}>2 — Easy</option>
            <option value={3}>3 — Medium</option>
            <option value={4}>4 — Complex</option>
            <option value={5}>5 — Very Complex</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">Due Date</label>
          <input
            type="date"
            value={formDueDate}
            onChange={(e) => setFormDueDate(e.target.value)}
            className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={formColor}
              onChange={(e) => setFormColor(e.target.value)}
              className="w-9 h-8 rounded border-none cursor-pointer"
            />
            <span className="text-xs text-purple-300/60">{formColor}</span>
          </div>
        </div>
      </div>
      <button
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
        onClick={onSubmit}
        disabled={creating}
      >
        {creating ? '⏳ Creating...' : '🚀 Create Task'}
      </button>
    </div>
  );
}
