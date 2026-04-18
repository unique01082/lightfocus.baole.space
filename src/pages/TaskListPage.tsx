import { useLocalStorageState, useRequest, useToggle } from 'ahooks';
import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import { subtasks as subtasksApi, tasks as tasksApi } from '../services/lf';
import type { LF } from '../services/lf/typings';
import type { Complexity, Priority } from '../types/task';
import { getRandomColor } from '../utils/colors';
import { rankTasks } from '../utils/ranking';
import CreateTaskForm from './TaskListPage/components/CreateTaskForm';
import TaskCard from './TaskListPage/components/TaskCard';
import TaskFilters from './TaskListPage/components/TaskFilters';

export default function TaskListPage() {
  const { user, loading: authLoading } = useAuth();

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

  const {
    data,
    mutate: setTasks,
    loading: loadingTasks,
  } = useRequest(
    tasksApi.tasksControllerFindAll,
    {
      defaultParams: [{ limit: 1000, offset: 0 }],
      ready: !authLoading && !!user,
      refreshDeps: [user],
    }
  );

  const tasks = (data as any)?.data || [];

  const { run: createTask, loading: creating } = useRequest(
    async () => {
      const createData: LF.CreateTaskDto = {
        title: formTitle.trim(),
        description: formDesc,
        priority: formPriority,
        complexity: formComplexity,
        dueDate: formDueDate || undefined,
        color: formColor,
      };

      await tasksApi.tasksControllerCreate(createData);
      const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
      setTasks(response);

      setFormTitle('');
      setFormDesc('');
      setFormPriority('medium');
      setFormComplexity(3);
      setFormDueDate('');
      setFormColor(getRandomColor());
      hideCreateForm();
    },
    { manual: true }
  );

  const { run: toggleComplete, loading: togglingComplete } = useRequest(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      await tasksApi.tasksControllerUpdate({ id }, { completed: !task.completed });
      const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
      setTasks(response);
    },
    { manual: true }
  );

  const { run: deleteTask, loading: deleting } = useRequest(
    async (id: string) => {
      await tasksApi.tasksControllerRemove({ id });
      const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
      setTasks(response);
    },
    { manual: true }
  );

  const { run: toggleSubtask, loading: togglingSubtask } = useRequest(
    async (taskId: string, subtaskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const subtask = (task.subtasks || []).find((s: any) => s.id === subtaskId);
      if (!subtask) return;

      await subtasksApi.subtasksControllerUpdate(
        { id: subtaskId, taskId },
        { completed: !subtask.completed }
      );

      const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
      setTasks(response);
    },
    { manual: true }
  );

  const { run: addSubtask, loading: addingSubtask } = useRequest(
    async (taskId: string, title: string) => {
      if (!title.trim()) return;

      await subtasksApi.subtasksControllerCreate(
        { taskId },
        { title: title.trim() }
      );

      const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
      setTasks(response);
    },
    { manual: true }
  );

  const handleCreate = () => {
    if (!formTitle.trim()) return;
    createTask();
  };

  if (authLoading) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="empty-state">
            <p className="empty-icon">⌛</p>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="empty-state">
            <p className="empty-icon">🔒</p>
            <p>Please log in to view your tasks</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadingTasks) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="empty-state">
            <p className="empty-icon">⌛</p>
            <p>Loading tasks...</p>
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
    <div className="page-container">
      <div className="page-content">
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--accent)', fontSize: '14px' }}>
            🪐 Solar System
          </Link>
          <button className="accent-btn" onClick={toggleCreateForm}>
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

        <div className="tasklist-items">
          {sorted.map((task) => (
            <TaskCard
              key={task.id}
              task={task as any}
              onToggleComplete={toggleComplete}
              onDelete={deleteTask}
              onToggleSubtask={toggleSubtask}
              onAddSubtask={addSubtask}
            />
          ))}

          {sorted.length === 0 && (
            <div className="empty-state">
              <p className="empty-icon">🪐</p>
              <p>No tasks found.</p>
              <button className="accent-btn" onClick={toggleCreateForm}>
                Create your first task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
