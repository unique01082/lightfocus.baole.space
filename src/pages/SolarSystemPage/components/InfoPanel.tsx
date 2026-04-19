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
    <div className="fixed bottom-4 left-4 bg-gradient-to-br from-indigo-950/90 via-purple-950/90 to-indigo-950/90 backdrop-blur-xl border-2 border-indigo-400/40 rounded-lg shadow-[0_0_25px_rgba(99,102,241,0.4)] p-4 min-w-[220px] z-10 relative">
      {/* Tech corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70" />
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 rounded-lg" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
      }} />
      <div className="flex items-center gap-2 mb-3 relative">
        <span className="text-cyan-400 text-sm animate-pulse">◆</span>
        <h3 className="text-sm font-bold text-cyan-100 uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] m-0">
          Mission Stats
        </h3>
      </div>
      <div className="space-y-2 text-xs text-indigo-100/90 relative">
        <div className="flex justify-between items-center hover:bg-white/5 px-2 py-1 rounded transition-colors">
          <span className="text-cyan-200/70">Total Tasks:</span>
          <span className="font-bold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] text-sm">{totalTasks}</span>
        </div>
        <div className="flex justify-between items-center hover:bg-white/5 px-2 py-1 rounded transition-colors">
          <span className="text-cyan-200/70">Active:</span>
          <span className="font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] text-sm">{activeTasks}</span>
        </div>
        <div className="flex justify-between items-center hover:bg-white/5 px-2 py-1 rounded transition-colors">
          <span className="text-cyan-200/70">Completed:</span>
          <span className="font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] text-sm">{completedTasks}</span>
        </div>
        {totalSubtasks > 0 && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent my-2" />
            <div className="flex justify-between items-center hover:bg-white/5 px-2 py-1 rounded transition-colors">
              <span className="text-cyan-200/70">Subtasks:</span>
              <span className="font-bold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] text-sm">
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
          </>
        )}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent my-2" />
        <div className="flex justify-between items-center hover:bg-white/5 px-2 py-1 rounded transition-colors">
          <span className="text-cyan-200/70">Ranked:</span>
          <span className="font-bold text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)] text-sm">{rankedTasks.length}</span>
        </div>
      </div>
    </div>
  );
}
