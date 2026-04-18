import { useRequest } from 'ahooks';
import { useState } from 'react';
import { subtasks as subtasksApi, tasks as tasksApi, type LF } from '../../../services/lf';
import type { Complexity, Priority, Subtask, Task } from '../../../types/task';
import { getRandomColor } from '../../../utils/colors';

export function useTaskOperations(
  tasks: Task[],
  setTasks: (tasks: Task[]) => void
) {
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPriority, setFormPriority] = useState<Priority>('medium');
  const [formComplexity, setFormComplexity] = useState<Complexity>(3);
  const [formDueDate, setFormDueDate] = useState('');
  const [formColor, setFormColor] = useState(getRandomColor());

  const resetForm = () => {
    setFormTitle('');
    setFormDesc('');
    setFormPriority('medium');
    setFormComplexity(3);
    setFormDueDate('');
    setFormColor(getRandomColor());
  };

  const { run: createTask, loading: creating } = useRequest(
    async (taskData: Partial<Task>) => {
      const createData: LF.CreateTaskDto = {
        title: taskData.title || 'New Task',
        description: typeof taskData.description === 'string' ? taskData.description : undefined,
        priority: taskData.priority || 'medium',
        complexity: taskData.complexity || 3,
        dueDate: typeof taskData.dueDate === 'string' ? taskData.dueDate : undefined,
        color: taskData.color || getRandomColor(),
      };
      const newTask = (await tasksApi.tasksControllerCreate(
        createData
      )) as unknown as Task;
      if (newTask) {
        setTasks([...tasks, newTask]);
        resetForm();
      }
      return newTask;
    },
    { manual: true }
  );

  const { run: toggleComplete, loading: togglingComplete } = useRequest(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return null;

      const updated = (await tasksApi.tasksControllerUpdate(
        { id },
        { completed: !task.completed }
      )) as unknown as Task;
      if (updated) {
        setTasks(tasks.map((t) => (t.id === id ? updated : t)));
      }
      return updated;
    },
    { manual: true }
  );

  const { run: deleteTask, loading: deleting } = useRequest(
    async (id: string) => {
      await tasksApi.tasksControllerRemove({ id });
      const success = true;
      if (success) {
        setTasks(tasks.filter((t) => t.id !== id));
      }
      return success;
    },
    { manual: true }
  );

  const { run: toggleSubtask, loading: togglingSubtask } = useRequest(
    async (taskId: string, subtaskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return null;

      const subtask = task.subtasks?.find((s) => s.id === subtaskId);
      if (!subtask) return null;

      const updatedSubtask = (await subtasksApi.subtasksControllerUpdate(
        { id: subtaskId, taskId },
        { completed: !subtask.completed }
      )) as unknown as Subtask;

      if (updatedSubtask) {
        setTasks(
          tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              subtasks: t.subtasks?.map((s) =>
                s.id === subtaskId ? updatedSubtask : s
              ),
            };
          })
        );
      }
      return updatedSubtask;
    },
    { manual: true }
  );

  const { run: addSubtask, loading: addingSubtask } = useRequest(
    async (taskId: string, title: string) => {
      if (!title.trim()) return null;

      const newSubtask = (await subtasksApi.subtasksControllerCreate(
        { taskId },
        { title: title.trim() }
      )) as unknown as Subtask;
      if (newSubtask) {
        setTasks(
          tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              subtasks: [...(t.subtasks || []), newSubtask],
            };
          })
        );
      }
      return newSubtask;
    },
    { manual: true }
  );

  return {
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
    createTask,
    creating,
    toggleComplete,
    togglingComplete,
    deleteTask,
    deleting,
    toggleSubtask,
    togglingSubtask,
    addSubtask,
    addingSubtask,
    resetForm,
  };
}
