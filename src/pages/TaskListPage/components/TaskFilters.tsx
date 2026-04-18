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
    <div className="tasklist-filters">
      <div className="filter-group">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => onFilterChange(f)}
          >
            {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
          </button>
        ))}
      </div>
      <div className="filter-group">
        <label style={{ fontSize: 12, opacity: 0.6 }}>Sort by:</label>
        <select
          className="sort-select"
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
