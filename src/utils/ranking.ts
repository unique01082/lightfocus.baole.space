import type { Task, Priority, BullseyeRank, RankedTask } from '../types/task';

/**
 * Calculate Bullseye rank (1-7) based on task properties.
 * Lower rank = more important = closer to sun.
 *
 * Factors:
 * - Priority (40% weight): critical=5, high=4, medium=3, low=2, none=1
 * - Complexity (30% weight): 1-5
 * - Due date urgency (30% weight): overdue=5, today=4, this week=3, this month=2, later/none=1
 */
export function calculateBullseyeRank(task: Task): BullseyeRank {
  const priorityScore = getPriorityScore(task.priority);
  const complexityScore = task.complexity;
  const urgencyScore = getUrgencyScore(task.dueDate);

  // Weighted score (max = 5.0)
  const weightedScore =
    priorityScore * 0.4 +
    complexityScore * 0.3 +
    urgencyScore * 0.3;

  // Map 1-5 score to 1-7 rank (inverted: higher score = lower rank number)
  if (weightedScore >= 4.5) return 1;
  if (weightedScore >= 3.8) return 2;
  if (weightedScore >= 3.2) return 3;
  if (weightedScore >= 2.6) return 4;
  if (weightedScore >= 2.0) return 5;
  if (weightedScore >= 1.4) return 6;
  return 7;
}

function getPriorityScore(priority: Priority): number {
  switch (priority) {
    case 'critical': return 5;
    case 'high': return 4;
    case 'medium': return 3;
    case 'low': return 2;
    case 'none': return 1;
  }
}

function getUrgencyScore(dueDate: string | null): number {
  if (!dueDate) return 1;

  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 5;      // overdue
  if (diffDays < 1) return 4;      // today
  if (diffDays < 7) return 3;      // this week
  if (diffDays < 30) return 2;     // this month
  return 1;                         // later
}

export function rankTasks(tasks: Task[]): RankedTask[] {
  return tasks.map(task => ({
    ...task,
    rank: calculateBullseyeRank(task),
  }));
}

/**
 * Group ranked tasks by their orbit (rank).
 */
export function groupByOrbit(rankedTasks: RankedTask[]): Map<BullseyeRank, RankedTask[]> {
  const groups = new Map<BullseyeRank, RankedTask[]>();
  for (let i = 1; i <= 7; i++) {
    groups.set(i as BullseyeRank, []);
  }
  for (const task of rankedTasks) {
    groups.get(task.rank)!.push(task);
  }
  return groups;
}
