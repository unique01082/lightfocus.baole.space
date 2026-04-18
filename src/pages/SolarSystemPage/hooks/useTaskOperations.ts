import { useRequest } from "ahooks";
import { useState } from "react";
import { subtasks as subtasksApi, tasks as tasksApi, type LF } from "../../../services/lf";
import type { Complexity, Priority, RankedTask } from "../../../types/task";
import { getRandomColor } from "../../../utils/colors";
import { rankTasks } from "../../../utils/ranking";

export function useTaskOperations(
  tasks: any[],
  setTasks: (data: any) => void,
  setShowCreateModal: (show: boolean) => void,
  setShowTaskPanel: (show: boolean) => void,
  setSelectedTask: (task: RankedTask | null) => void,
) {
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<Priority>("medium");
  const [formComplexity, setFormComplexity] = useState<Complexity>(3);
  const [formDueDate, setFormDueDate] = useState("");
  const [formColor, setFormColor] = useState(() => getRandomColor());

  const refetchTasks = () =>
    tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 }).then(setTasks);

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormPriority("medium");
    setFormComplexity(3);
    setFormDueDate("");
    setFormColor(getRandomColor());
  };

  const { run: createTask, loading: creating } = useRequest(
    async () => {
      if (!formTitle.trim()) return null;
      const newTask = await tasksApi.tasksControllerCreate({
        title: formTitle.trim(),
        description: formDesc,
        priority: formPriority,
        complexity: formComplexity,
        dueDate: formDueDate || undefined,
        color: formColor,
      });
      if (newTask) {
        await refetchTasks();
        resetForm();
        setShowCreateModal(false);
      }
      return newTask;
    },
    { manual: true },
  );

  const { run: deleteTask, loading: deleting } = useRequest(
    async (id: string) => {
      await tasksApi.tasksControllerRemove({ id });
      await refetchTasks();
      setShowTaskPanel(false);
      setSelectedTask(null);
      return true;
    },
    { manual: true },
  );

  const { run: toggleComplete, loading: togglingComplete } = useRequest(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return null;
      const updated = await tasksApi.tasksControllerUpdate(
        { id },
        { completed: !task.completed },
      );
      if (updated) {
        await refetchTasks();
        setShowTaskPanel(false);
        setSelectedTask(null);
      }
      return updated;
    },
    { manual: true },
  );

  const { run: addSubtask, loading: addingSubtask } = useRequest(
    async (taskId: string, title: string) => {
      if (!title.trim()) return null;
      const newSubtask = await subtasksApi.subtasksControllerCreate(
        { taskId },
        { title: title.trim() },
      );
      if (newSubtask) await refetchTasks();
      return newSubtask;
    },
    { manual: true },
  );

  const { run: toggleSubtask, loading: togglingSubtask } = useRequest(
    async (taskId: string, subtaskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return null;
      const subtask = (task.subtasks || []).find((s: any) => s.id === subtaskId);
      if (!subtask) return null;
      const updated = await subtasksApi.subtasksControllerUpdate(
        { id: subtaskId, taskId },
        { completed: !subtask.completed },
      );
      if (updated) await refetchTasks();
      return updated;
    },
    { manual: true },
  );

  const handleDeleteSubtask = async () => {
    await refetchTasks();
  };

  const handleTaskUpdate = (selectedTask: RankedTask | null, updates: Partial<RankedTask>) => {
    if (!selectedTask) return;
    const updateData: LF.UpdateTaskDto = {
      title: updates.title,
      description: updates.description as any,
      priority: updates.priority,
      complexity: updates.complexity,
      dueDate: updates.dueDate as any,
      color: updates.color,
    };
    tasksApi
      .tasksControllerUpdate({ id: selectedTask.id }, updateData)
      .then((updated) => {
        if (updated) {
          refetchTasks().then(() => {
            const ranked = rankTasks([updated as any]);
            setSelectedTask(ranked[0]);
          });
        }
      });
  };

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
    resetForm,
    createTask,
    creating,
    deleteTask,
    deleting,
    toggleComplete,
    togglingComplete,
    addSubtask,
    addingSubtask,
    toggleSubtask,
    togglingSubtask,
    handleDeleteSubtask,
    handleTaskUpdate,
  };
}
