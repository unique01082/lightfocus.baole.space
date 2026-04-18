import type { RankedTask, Task } from "../../../types/task";

interface InfoPanelProps {
  tasks: Task[];
  uiHidden: boolean;
  rankedTasks: RankedTask[];
}

export default function InfoPanel({ tasks, uiHidden, rankedTasks }: InfoPanelProps) {
  if (uiHidden) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const totalSubtasks = tasks.reduce((sum, task) => sum + (task.subtasks?.length || 0), 0);
  const completedSubtasks = tasks.reduce(
    (sum, task) => sum + (task.subtasks?.filter((st) => st.completed).length || 0),
    0
  );

  return (
    <div className="fixed bottom-4 left-4 bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-lg border border-purple-500/30 rounded-lg shadow-lg shadow-purple-500/20 p-4 min-w-[200px] z-10">
      <h3 className="text-sm font-semibold text-purple-200 mb-3 uppercase tracking-wide">
        Mission Stats
      </h3>
      <div className="space-y-2 text-xs text-purple-100/80">
        <div className="flex justify-between">
          <span>Total Tasks:</span>
          <span className="font-semibold text-white">{totalTasks}</span>
        </div>
        <div className="flex justify-between">
          <span>Active:</span>
          <span className="font-semibold text-purple-300">{activeTasks}</span>
        </div>
        <div className="flex justify-between">
          <span>Completed:</span>
          <span className="font-semibold text-green-400">{completedTasks}</span>
        </div>
        {totalSubtasks > 0 && (
          <>
            <div className="h-px bg-purple-500/30 my-2" />
            <div className="flex justify-between">
              <span>Subtasks:</span>
              <span className="font-semibold text-white">
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
          </>
        )}
        <div className="h-px bg-purple-500/30 my-2" />
        <div className="flex justify-between">
          <span>Ranked:</span>
          <span className="font-semibold text-pink-400">{rankedTasks.length}</span>
        </div>
      </div>
    </div>
  );
}
