interface TaskFiltersProps {
  filter: 'all' | 'active' | 'completed';
  sortBy: 'rank' | 'priority' | 'dueDate' | 'created';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onSortChange: (sortBy: 'rank' | 'priority' | 'dueDate' | 'created') => void;
}

export default function TaskFilters({
  filter,
  sortBy,
  onFilterChange,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <div className="flex gap-2">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              filter === f
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/40 border border-purple-400/30'
            }`}
            onClick={() => onFilterChange(f)}
          >
            {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-xs text-purple-300/60">Sort by:</label>
        <select
          className="bg-black/30 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200"
          value={sortBy}
          onChange={(e) =>
            onSortChange(
              e.target.value as 'rank' | 'priority' | 'dueDate' | 'created'
            )
          }
        >
          <option value="rank">Bullseye Rank</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
          <option value="created">Recently Created</option>
        </select>
      </div>
    </div>
  );
}
