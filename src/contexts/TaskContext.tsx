import { useRequest } from 'ahooks';
import { createContext, useContext, type ReactNode } from 'react';
import { subtasks as subtasksApi, tasks as tasksApi } from '../services/lf';
import type { LF } from '../services/lf/typings';
import type { Complexity, Priority, RankedTask, Task } from '../types/task';
import { rankTasks } from '../utils/ranking';

interface TaskContextValue {
  tasks: Task[];
  rankedTasks: RankedTask[];
  loading: boolean;
  error: Error | undefined;

  // Task operations
  createTask: (data: {
    title: string;
    description?: string;
    priority: Priority;
    complexity: Complexity;
    dueDate?: string;
    color?: string;
  }) => Promise<void>;
  updateTask: (taskId: string, updates: LF.UpdateTaskDto) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;

  // Subtask operations
  addSubtask: (taskId: string, title: string) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => Promise<void>;

  // Refresh
  refresh: () => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const {
    data: { data: tasks = [] } = {},
    loading,
    error,
    mutate: setTasks,
    refresh
  } = useRequest(
    tasksApi.tasksControllerFindAll,
    {
      defaultParams: [{ limit: 1000, offset: 0 }],
      onSuccess: ({ data }) => console.log('Tasks loaded:', data.length),
    },
  );

  const rankedTasks = rankTasks(tasks);

  const createTask = async (data: {
    title: string;
    description?: string;
    priority: Priority;
    complexity: Complexity;
    dueDate?: string;
    color?: string;
  }) => {
    await tasksApi.tasksControllerCreate({
      title: data.title,
      description: typeof data.description === 'string' ? data.description : undefined,
      priority: data.priority,
      complexity: data.complexity,
      dueDate: typeof data.dueDate === 'string' ? data.dueDate : undefined,
      color: data.color,
    });

    const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
    setTasks(response);
  };

  const updateTask = async (taskId: string, updates: LF.UpdateTaskDto) => {
    await tasksApi.tasksControllerUpdate({ id: taskId }, updates);
    const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
    setTasks(response);
  };

  const deleteTask = async (taskId: string) => {
    await tasksApi.tasksControllerRemove({ id: taskId });
    const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
    setTasks(response);
  };

  const toggleTaskComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    await tasksApi.tasksControllerUpdate({ id: taskId }, { completed: newCompleted });

    const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
    setTasks(response);
  };

  const addSubtask = async (taskId: string, title: string) => {
    if (!title.trim()) return;

    await subtasksApi.subtasksControllerCreate(
      { taskId },
      { title: title.trim() }
    );

    const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
    setTasks(response);
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    await subtasksApi.subtasksControllerRemove({ id: subtaskId, taskId });

    const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
    setTasks(response);
  };

  const toggleSubtaskComplete = async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.subtasks) return;

    const subtask = (task.subtasks as any[]).find((s: any) => s.id === subtaskId);
    if (!subtask) return;

    await subtasksApi.subtasksControllerUpdate(
      { id: subtaskId, taskId },
      { completed: !subtask.completed }
    );

    const response = await tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 });
    setTasks(response);
  };

  const handleRefresh = async () => {
    refresh();
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        rankedTasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        addSubtask,
        deleteSubtask,
        toggleSubtaskComplete,
        refresh: handleRefresh,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
