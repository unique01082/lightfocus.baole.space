import { useMemoizedFn, useRequest, useSetState } from 'ahooks';
import { subtasks as subtasksApi, tasks as tasksApi, type LF } from "../../../services/lf";
import { timeline as timelineApi } from "../../../services/lfai";
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
  const [formState, setFormState] = useSetState<{
    formTitle: string;
    formDesc: string;
    formPriority: Priority;
    formComplexity: Complexity;
    formDueDate: string;
    formColor: string;
  }>({
    formTitle: '',
    formDesc: '',
    formPriority: 'medium',
    formComplexity: 3,
    formDueDate: '',
    formColor: getRandomColor(),
  });

  const { formTitle, formDesc, formPriority, formComplexity, formDueDate, formColor } = formState;

  const setFormTitle = useMemoizedFn((value: string) => setFormState({ formTitle: value }));
  const setFormDesc = useMemoizedFn((value: string) => setFormState({ formDesc: value }));
  const setFormPriority = useMemoizedFn((value: Priority) => setFormState({ formPriority: value }));
  const setFormComplexity = useMemoizedFn((value: Complexity) => setFormState({ formComplexity: value }));
  const setFormDueDate = useMemoizedFn((value: string) => setFormState({ formDueDate: value }));
  const setFormColor = useMemoizedFn((value: string) => setFormState({ formColor: value }));

  const refetchTasks = useMemoizedFn(() =>
    tasksApi.tasksControllerFindAll({ limit: 1000, offset: 0 }).then(setTasks)
  );

  const resetForm = useMemoizedFn(() => {
    setFormState({
      formTitle: '',
      formDesc: '',
      formPriority: 'medium',
      formComplexity: 3,
      formDueDate: '',
      formColor: getRandomColor(),
    });
  });

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
        timelineApi.reportActivity({
          eventType: 'task_created',
          data: { taskId: (newTask as any).id, title: formTitle.trim(), priority: formPriority, complexity: formComplexity },
        }).catch(console.warn);
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
        timelineApi.reportActivity({
          eventType: task.completed ? 'task_uncompleted' : 'task_completed',
          data: { taskId: id, title: task.title },
        }).catch(console.warn);
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
      if (newSubtask) {
        await refetchTasks();
        timelineApi.reportActivity({
          eventType: 'subtask_created',
          data: { taskId, subtaskTitle: title.trim() },
        }).catch(console.warn);
      }
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
      if (updated) {
        await refetchTasks();
        timelineApi.reportActivity({
          eventType: subtask.completed ? 'subtask_uncompleted' : 'subtask_completed',
          data: { taskId, subtaskTitle: subtask.title },
        }).catch(console.warn);
      }
      return updated;
    },
    { manual: true },
  );

  const handleDeleteSubtask = useMemoizedFn(async () => {
    await refetchTasks();
  });

  const handleTaskUpdate = useMemoizedFn((selectedTask: RankedTask | null, updates: Partial<RankedTask>) => {
    if (!selectedTask) return;
    const snapshot = { ...selectedTask };
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
          if (updates.priority !== undefined && updates.priority !== snapshot.priority) {
            timelineApi.reportActivity({
              eventType: 'task_priority_changed',
              data: { taskId: selectedTask.id, from: snapshot.priority, to: updates.priority },
            }).catch(console.warn);
          }
          if (updates.complexity !== undefined && updates.complexity !== snapshot.complexity) {
            timelineApi.reportActivity({
              eventType: 'task_complexity_changed',
              data: { taskId: selectedTask.id, from: snapshot.complexity, to: updates.complexity },
            }).catch(console.warn);
          }
          if (updates.dueDate !== undefined && updates.dueDate !== snapshot.dueDate) {
            timelineApi.reportActivity({
              eventType: 'task_due_date_changed',
              data: { taskId: selectedTask.id, dueDate: updates.dueDate },
            }).catch(console.warn);
          }
        }
      });
  });

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
