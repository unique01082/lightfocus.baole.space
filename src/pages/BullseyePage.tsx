import { useEffect, useRef, useState } from 'react';
import ViewModeSwitcher from '../components/ViewModeSwitcher';
import { useTasks } from '../contexts/TaskContext';
import type { RankedTask } from '../types/task';

const ORBIT_LABELS: Record<number, string> = {
  1: 'Critical',
  2: 'Very High',
  3: 'High',
  4: 'Medium',
  5: 'Low',
  6: 'Very Low',
  7: 'Minimal',
};

const ORBIT_COLORS: Record<number, string> = {
  1: 'rgba(220, 38, 38, 0.2)',
  2: 'rgba(234, 88, 12, 0.2)',
  3: 'rgba(234, 179, 8, 0.2)',
  4: 'rgba(34, 197, 94, 0.2)',
  5: 'rgba(59, 130, 246, 0.2)',
  6: 'rgba(139, 92, 246, 0.2)',
  7: 'rgba(156, 163, 175, 0.2)',
};

// Hash string to deterministic number for stable rotation
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}

function stableRotation(id: string): number {
  return ((hashCode(id) % 12) - 6); // -6 to +6 degrees
}

// Sticky note width is 80px (w-20). Min gap = 80 * 1.1 = 88px.
// More important rings (lower rank) get more space.
function computeRingRadii(minRadius: number): number[] {
  // Weight: rank 1 gets weight 7, rank 7 gets weight 1
  const weights = [7, 6, 5, 4, 3, 2, 1];
  const minGap = 88; // sticky note width (80) + 10%
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  // Extra space to distribute proportionally
  const extra = 300; // additional radius budget for visual quality

  const gaps: number[] = [];
  for (let i = 0; i < 7; i++) {
    gaps.push(minGap + (extra * weights[i]) / totalWeight);
  }

  // Compute cumulative radii
  const radii: number[] = [];
  let current = minRadius;
  for (let i = 0; i < 7; i++) {
    current += gaps[i];
    radii.push(current);
  }
  return radii;
}

interface StickyNoteProps {
  task: RankedTask;
  angle: number;
  radius: number;
  onClick: () => void;
}

function StickyNote({ task, angle, radius, onClick }: StickyNoteProps) {
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const rotation = stableRotation(task.id);

  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
    >
      {/* Pin/Tack at top */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg border border-red-900">
          <div className="w-1 h-1 rounded-full bg-white/40 absolute top-0.5 left-0.5" />
        </div>
        <div className="w-0.5 h-2 bg-gradient-to-b from-gray-400 to-gray-600 mx-auto" />
      </div>

      <div
        className="w-20 h-20 rounded-lg shadow-lg p-2 transition-all duration-300
          hover:scale-110 hover:shadow-2xl hover:z-10 border-2"
        style={{
          backgroundColor: task.color || '#fef3c7',
          borderColor: task.completed ? '#22c55e' : 'rgba(0,0,0,0.1)',
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div className="flex flex-col h-full">
          <div className="text-[10px] font-bold text-gray-800 mb-1 line-clamp-2 leading-tight">
            {task.title}
          </div>
          <div className="text-[8px] text-gray-600 opacity-70 flex-1">
            P{task.priority} • C{task.complexity}
          </div>
          <div className="flex items-center justify-between mt-auto">
            {task.completed && (
              <span className="text-sm">✅</span>
            )}
            {task.subtasks && task.subtasks.length > 0 && (
              <span className="text-[8px] text-gray-600">
                🌙 {task.subtasks.filter((s: any) => s.completed).length}/{task.subtasks.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BullseyePage() {
  const { rankedTasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState<RankedTask | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTask) {
        setSelectedTask(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedTask]);

  // Separate active and completed tasks
  const activeTasks = rankedTasks.filter((t) => !t.completed);
  const completedTasks = rankedTasks.filter((t) => t.completed);

  // Group active tasks by rank
  const tasksByRank: Record<number, RankedTask[]> = {};
  for (let i = 1; i <= 7; i++) {
    tasksByRank[i] = [];
  }
  activeTasks.forEach((task) => {
    if (tasksByRank[task.rank]) {
      tasksByRank[task.rank].push(task);
    }
  });

  // Calculate positions for each ring - unequal spacing, more space for important rings
  const minRadius = 60;
  const ringRadii = computeRingRadii(minRadius);
  const maxRadius = ringRadii[6]; // outermost ring
  // Completed tasks are placed outside the last ring
  const completedRingRadius = maxRadius + 100;

  // Pan/Zoom handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.sticky-note, .planet-label')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.3, Math.min(3, prev * delta)));
  };

  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div
      className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <ViewModeSwitcher />

      {/* Pan/Zoom Controls */}
      <div className="fixed bottom-4 right-4 z-[998] flex flex-col gap-2">
        <button
          onClick={resetView}
          className="bg-gradient-to-br from-purple-600/90 to-indigo-600/90 backdrop-blur-xl text-white px-4 py-2 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 border border-purple-400/30 text-sm font-bold"
        >
          🎯 Reset View
        </button>
        <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl text-white px-3 py-2 rounded-full shadow-lg border border-purple-400/30 text-xs text-center">
          Zoom: {(zoom * 100).toFixed(0)}%
        </div>
      </div>

      {/* Bullseye Target */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center mt-12"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        <div className="relative" style={{ width: (maxRadius + 200) * 2 + 100, height: (maxRadius + 200) * 2 + 100 }}>
          {/* Draw concentric circles */}
          {[1, 2, 3, 4, 5, 6, 7].map((ring) => {
            const radius = ringRadii[ring - 1];
            return (
              <div
                key={ring}
                className="absolute rounded-full border-2 border-white/20"
                style={{
                  width: radius * 2,
                  height: radius * 2,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: ORBIT_COLORS[ring],
                }}
              >
                {/* Ring label */}
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full
                    text-white/70 text-xs font-semibold py-1 px-2 rounded-full bg-black/30 backdrop-blur-sm"
                  style={{ marginTop: -8 }}
                >
                  Ring {ring}: {ORBIT_LABELS[ring]}
                </div>
              </div>
            );
          })}

          {/* Completed tasks outer ring */}
          {completedTasks.length > 0 && (
            <div
              className="absolute rounded-full border-2 border-dashed border-green-400/40"
              style={{
                width: completedRingRadius * 2,
                height: completedRingRadius * 2,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(34, 197, 94, 0.04)',
              }}
            >
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full
                  text-green-300/80 text-xs font-semibold py-1 px-2 rounded-full bg-black/30 backdrop-blur-sm"
                style={{ marginTop: -8 }}
              >
                ✅ Completed
              </div>
            </div>
          )}

          {/* Center dot */}
          <div
            className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500
              border-2 border-white shadow-lg"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Place active tasks as sticky notes */}
          {Object.entries(tasksByRank).map(([rank, tasks]) => {
            const rankNum = Number(rank);
            // Position in the middle of the ring band
            const innerR = rankNum === 1 ? minRadius : ringRadii[rankNum - 2];
            const outerR = ringRadii[rankNum - 1];
            const ringRadius = (innerR + outerR) / 2;
            return tasks.map((task, index) => {
              const angle = (index / tasks.length) * Math.PI * 2;
              return (
                <div key={task.id} className="sticky-note">
                  <StickyNote
                    task={task}
                    angle={angle}
                    radius={ringRadius}
                    onClick={() => setSelectedTask(task)}
                  />
                </div>
              );
            });
          })}

          {/* Completed tasks - pinned on board outside circles, stackable */}
          {completedTasks.map((task, index) => {
            // Random stacking position in corners and edges
            const cornerPositions = [
              { x: -maxRadius - 150, y: -maxRadius - 100 }, // Top-left
              { x: maxRadius + 150, y: -maxRadius - 100 },  // Top-right
              { x: -maxRadius - 150, y: maxRadius + 100 },  // Bottom-left
              { x: maxRadius + 150, y: maxRadius + 100 },   // Bottom-right
              { x: 0, y: -maxRadius - 150 },                // Top center
              { x: 0, y: maxRadius + 150 },                 // Bottom center
              { x: -maxRadius - 200, y: 0 },                // Left center
              { x: maxRadius + 200, y: 0 },                 // Right center
            ];

            const cornerIndex = index % cornerPositions.length;
            const basePos = cornerPositions[cornerIndex];
            const stackOffset = Math.floor(index / cornerPositions.length);

            // Add slight offset based on task id for natural stacking
            const idHash = hashCode(task.id);
            const x = basePos.x + ((idHash % 40) - 20) + stackOffset * 8;
            const y = basePos.y + (((idHash >> 8) % 40) - 20) + stackOffset * 8;
            const completedRotation = stableRotation(task.id + '_completed');

            return (
              <div
                key={task.id}
                className="sticky-note absolute cursor-pointer group"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10 + index,
                }}
                onClick={() => setSelectedTask(task)}
              >
                <div
                  className="w-20 h-20 rounded-lg shadow-lg p-2 transition-all duration-300
                    hover:scale-110 hover:shadow-2xl hover:z-[100] border-2"
                  style={{
                    backgroundColor: task.color || '#dcfce7',
                    borderColor: '#22c55e',
                    transform: `rotate(${completedRotation}deg)`,
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className="text-[9px] font-bold text-gray-700 leading-tight line-clamp-2 mb-1">
                      {task.title}
                    </div>
                    <div className="text-[7px] text-gray-500 mb-auto">
                      Rank {task.rank}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-green-600 text-sm">✓</span>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <span className="text-[8px] text-gray-600">
                          🌙 {task.subtasks.filter((s: any) => s.completed).length}/{task.subtasks.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task detail modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(0, 0, 0, 0.5)',
          }}
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-900/95
              backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 max-w-md w-full
              shadow-2xl shadow-purple-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-full shadow-lg"
                style={{ backgroundColor: selectedTask.color }}
              />
              <h2 className="text-xl font-bold text-white flex-1">
                {selectedTask.title}
              </h2>
              <button
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/20
                  text-white transition-all"
                onClick={() => setSelectedTask(null)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-purple-300/70 text-xs">Priority</div>
                  <div className="text-white font-semibold">{selectedTask.priority}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-purple-300/70 text-xs">Complexity</div>
                  <div className="text-white font-semibold">C{selectedTask.complexity}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-purple-300/70 text-xs">Ring</div>
                  <div className="text-white font-semibold">
                    {selectedTask.rank} - {ORBIT_LABELS[selectedTask.rank]}
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-purple-300/70 text-xs">Status</div>
                  <div className="text-white font-semibold">
                    {selectedTask.completed ? '✅ Done' : '⏳ Active'}
                  </div>
                </div>
              </div>

              {selectedTask.description && typeof selectedTask.description === 'string' && (
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-purple-300/70 text-xs mb-1">Description</div>
                  <div className="text-white/90">{selectedTask.description}</div>
                </div>
              )}

              {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-purple-300/70 text-xs mb-2">Subtasks</div>
                  <div className="space-y-1">
                    {(selectedTask.subtasks as any[]).map((sub: any) => (
                      <div
                        key={sub.id}
                        className="text-white/80 text-xs flex items-center gap-2"
                      >
                        <span>{sub.completed ? '✅' : '⏳'}</span>
                        <span className={sub.completed ? 'line-through opacity-60' : ''}>
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
