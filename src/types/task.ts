export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type Priority = 'critical' | 'high' | 'medium' | 'low' | 'none';
export type Complexity = 1 | 2 | 3 | 4 | 5;

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  complexity: Complexity;
  dueDate: string | null; // ISO date string
  completed: boolean;
  subtasks: Subtask[];
  color: string; // hex color for the planet
  createdAt: string;
  updatedAt: string;
}

/**
 * Bullseye Prioritization Ranking (1-7)
 * 1 = closest to sun (most important/urgent)
 * 7 = farthest from sun (least important)
 */
export type BullseyeRank = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface RankedTask extends Task {
  rank: BullseyeRank;
}
