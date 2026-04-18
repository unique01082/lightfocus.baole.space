import { useLocalStorageState, useToggle } from 'ahooks';
import { useState } from 'react';
import { Link } from 'react-router';
import ViewModeSwitcher from '../components/ViewModeSwitcher';
import { useTasks } from '../contexts/TaskContext';
import { useAuth } from '../contexts/useAuth';
import type { Complexity, Priority } from '../types/task';
import { getRandomColor } from '../utils/colors';
import { rankTasks } from '../utils/ranking';
import CreateTaskForm from './TaskListPage/components/CreateTaskForm';
import TaskCard from './TaskListPage/components/TaskCard';
import TaskFilters from './TaskListPage/components/TaskFilters';

export default function TaskListPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    tasks,
    loading: loadingTasks,
    createTask: createTaskApi,
    deleteTask: deleteTaskApi,
    toggleTaskComplete,
    addSubtask: addSubtaskApi,
    toggleSubtaskComplete,
  } = useTasks();

  console.log('tasks :>> ', tasks);

  const [filter, setFilter] = useLocalStorageState<'all' | 'active' | 'completed'>('taskFilter', {
    defaultValue: 'all'
  });
  const [sortBy, setSortBy] = useLocalStorageState<'rank' | 'priority' | 'dueDate' | 'created'>('taskSort', {
    defaultValue: 'rank'
  });
  const [showCreateForm, { toggle: toggleCreateForm, setLeft: hideCreateForm }] = useToggle(false);

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPriority, setFormPriority] = useState<Priority>('medium');
  const [formComplexity, setFormComplexity] = useState<Complexity>(3);
  const [formDueDate, setFormDueDate] = useState('');
  const [formColor, setFormColor] = useState(getRandomColor());
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!formTitle.trim()) return;

    setCreating(true);
    try {
      await createTaskApi({
        title: formTitle.trim(),
        description: formDesc,
        priority: formPriority,
        complexity: formComplexity,
        dueDate: formDueDate || undefined,
        color: formColor,
      });

      setFormTitle('');
      setFormDesc('');
      setFormPriority('medium');
      setFormComplexity(3);
      setFormDueDate('');
      setFormColor(getRandomColor());
      hideCreateForm();
    } finally {
      setCreating(false);
    }
  };

  const handleToggleComplete = async (id: string) => {
    await toggleTaskComplete(id);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTaskApi(id);
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    await toggleSubtaskComplete(taskId, subtaskId);
  };

  const handleAddSubtask = async (taskId: string, title: string) => {
    if (!title.trim()) return;
    await addSubtaskApi(taskId, title.trim());
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-6xl mb-4">⌛</p>
            <p className="text-purple-200">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔒</p>
            <p className="text-purple-200">Please log in to view your tasks</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadingTasks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-6xl mb-4">⌛</p>
            <p className="text-purple-200">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  let filtered = tasks;
  if (filter === 'active') {
    filtered = tasks.filter((t) => !t.completed);
  } else if (filter === 'completed') {
    filtered = tasks.filter((t) => t.completed);
  }
console.log('filtered :>> ', filtered, filter);
  let sorted = [...filtered];
  if (sortBy === 'rank') {
    const ranked = rankTasks(sorted as any);
    sorted = ranked as any;
  } else if (sortBy === 'priority') {
    const priorityOrder: Record<Priority, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      none: 1,
    };
    sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  } else if (sortBy === 'dueDate') {
    sorted.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate as any).getTime() - new Date(b.dueDate as any).getTime();
    });
  } else if (sortBy === 'created') {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
      <ViewModeSwitcher />

      <div className="max-w-7xl mx-auto mt-12">
        <div className="mb-6 flex gap-3 items-center flex-wrap">
          <Link to="/" className="text-purple-300 hover:text-purple-200 text-sm font-semibold transition-colors">
            🪐 Solar System
          </Link>
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            onClick={toggleCreateForm}
          >
            {showCreateForm ? '✕ Cancel' : '➕ New Task'}
          </button>
        </div>

        {showCreateForm && (
          <CreateTaskForm
            formTitle={formTitle}
            formDesc={formDesc}
            formPriority={formPriority}
            formComplexity={formComplexity}
            formDueDate={formDueDate}
            formColor={formColor}
            setFormTitle={setFormTitle}
            setFormDesc={setFormDesc}
            setFormPriority={setFormPriority}
            setFormComplexity={setFormComplexity}
            setFormDueDate={setFormDueDate}
            setFormColor={setFormColor}
            onSubmit={handleCreate}
            creating={creating}
          />
        )}

        <TaskFilters
          filter={filter}
          sortBy={sortBy}
          onFilterChange={setFilter}
          onSortChange={setSortBy}
        />

        <div className="space-y-4">
          {sorted.map((task) => (
            <TaskCard
              key={task.id}
              task={task as any}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onToggleSubtask={handleToggleSubtask}
              onAddSubtask={handleAddSubtask}
            />
          ))}

          {sorted.length === 0 && (
            <div className="text-center py-20">
              <p className="text-7xl mb-4">🪐</p>
              <p className="text-purple-200 text-lg mb-6">No tasks found.</p>
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
                onClick={toggleCreateForm}
              >
                Create your first task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
