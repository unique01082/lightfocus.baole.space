// Use server types from API
import type { LF } from '../services/lf/typings';

// Re-export server types with app-friendly names
export type Subtask = LF.SubtaskEntity;
export type Task = LF.TaskEntity;
export type RankedTask = LF.RankedTaskEntity;

// Keep local type aliases for convenience
export type Priority = 'critical' | 'high' | 'medium' | 'low' | 'none';
export type Complexity = 1 | 2 | 3 | 4 | 5;

/**
 * Bullseye Prioritization Ranking (1-7)
 * 1 = closest to sun (most important/urgent)
 * 7 = farthest from sun (least important)
 */
export type BullseyeRank = 1 | 2 | 3 | 4 | 5 | 6 | 7;
