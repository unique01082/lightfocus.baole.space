export declare namespace LF {
  type BullseyeResponseEntity = {
    /** All tasks with calculated bullseye ranks */
    tasks: RankedTaskEntity[];
    /** Tasks grouped by orbit/rank (1-7) */
    grouped: Record<string, any>;
  };

  type CreateSubtaskDto = {
    title: string;
  };

  type CreateTaskDto = {
    title: string;
    description?: string;
    priority: "critical" | "high" | "medium" | "low" | "none";
    /** Complexity from 1 (simple) to 5 (complex) */
    complexity: number;
    dueDate?: string;
    /** Hex color for planet visualization */
    color?: string;
  };

  type CreateUserConfigDto = {
    /** Predefined ranking algorithm to use */
    rankingAlgorithm:
      | "BALANCED"
      | "PRIORITY_FOCUSED"
      | "DEADLINE_FOCUSED"
      | "COMPLEXITY_FOCUSED"
      | "CUSTOM";
    /** Weight for priority factor (0.0-1.0, only used for CUSTOM algorithm) */
    priorityWeight?: number;
    /** Weight for complexity factor (0.0-1.0, only used for CUSTOM algorithm) */
    complexityWeight?: number;
    /** Weight for urgency factor (0.0-1.0, only used for CUSTOM algorithm) */
    urgencyWeight?: number;
    /** Enable time-based boosting for old tasks approaching deadline */
    enableTimeBoosting?: boolean;
  };

  type ErrorResponseEntity = {
    statusCode: number;
    message: Record<string, any>;
    error: string;
  };

  type ForbiddenResponseEntity = {
    statusCode: number;
    message: string;
    error: string;
  };

  type MetaEntity = {
    total: number;
    limit: number;
    offset: number;
  };

  type NotFoundResponseEntity = {
    statusCode: number;
    message: string;
    error: string;
  };

  type PaginatedTasksEntity = {
    data: TaskEntity[];
    meta: MetaEntity;
  };

  type RankedTaskEntity = {
    id: string;
    userSub: string;
    title: string;
    description?: Record<string, any>;
    priority: "critical" | "high" | "medium" | "low" | "none";
    complexity: number;
    dueDate?: Record<string, any>;
    completed: boolean;
    color: string;
    createdAt: string;
    updatedAt: string;
    /** Subtasks array (only included when explicitly requested) */
    subtasks?: any[];
    /** Bullseye rank (1-7), where 1 is most important (closest to sun) */
    rank: number;
  };

  type SubtaskEntity = {
    id: string;
    taskId: string;
    title: string;
    completed: boolean;
    createdAt: string;
  };

  type SubtasksControllerCreateParams = {
    /** Parent task UUID */
    taskId: string;
  };

  type SubtasksControllerFindAllParams = {
    /** Parent task UUID */
    taskId: string;
  };

  type SubtasksControllerFindOneParams = {
    /** Subtask UUID */
    id: string;
    /** Parent task UUID */
    taskId: string;
  };

  type SubtasksControllerRemoveParams = {
    /** Subtask UUID */
    id: string;
    /** Parent task UUID */
    taskId: string;
  };

  type SubtasksControllerUpdateParams = {
    /** Subtask UUID */
    id: string;
    /** Parent task UUID */
    taskId: string;
  };

  type TaskEntity = {
    id: string;
    userSub: string;
    title: string;
    description?: Record<string, any>;
    priority: "critical" | "high" | "medium" | "low" | "none";
    complexity: number;
    dueDate?: Record<string, any>;
    completed: boolean;
    color: string;
    createdAt: string;
    updatedAt: string;
    /** Subtasks array (only included when explicitly requested) */
    subtasks?: any[];
  };

  type TasksControllerFindAllParams = {
    limit?: number;
    offset?: number;
    completed?: boolean;
  };

  type TasksControllerFindOneParams = {
    /** Task UUID */
    id: string;
  };

  type TasksControllerRemoveParams = {
    /** Task UUID */
    id: string;
  };

  type TasksControllerUpdateParams = {
    /** Task UUID */
    id: string;
  };

  type UnauthorizedResponseEntity = {
    statusCode: number;
    message: string;
  };

  type UpdateSubtaskDto = {
    title?: string;
    completed?: boolean;
  };

  type UpdateTaskDto = {
    title?: string;
    description?: string;
    priority?: "critical" | "high" | "medium" | "low" | "none";
    /** Complexity from 1 (simple) to 5 (complex) */
    complexity?: number;
    dueDate?: string;
    /** Hex color for planet visualization */
    color?: string;
    completed?: boolean;
  };

  type UpdateUserConfigDto = {
    /** Predefined ranking algorithm to use */
    rankingAlgorithm?:
      | "BALANCED"
      | "PRIORITY_FOCUSED"
      | "DEADLINE_FOCUSED"
      | "COMPLEXITY_FOCUSED"
      | "CUSTOM";
    /** Weight for priority factor (0.0-1.0, only used for CUSTOM algorithm) */
    priorityWeight?: number;
    /** Weight for complexity factor (0.0-1.0, only used for CUSTOM algorithm) */
    complexityWeight?: number;
    /** Weight for urgency factor (0.0-1.0, only used for CUSTOM algorithm) */
    urgencyWeight?: number;
    /** Enable time-based boosting for old tasks approaching deadline */
    enableTimeBoosting?: boolean;
  };

  type UserConfigEntity = {
    id: string;
    userSub: string;
    rankingAlgorithm:
      | "BALANCED"
      | "PRIORITY_FOCUSED"
      | "DEADLINE_FOCUSED"
      | "COMPLEXITY_FOCUSED"
      | "CUSTOM";
    priorityWeight: number;
    complexityWeight: number;
    urgencyWeight: number;
    enableTimeBoosting: boolean;
    createdAt: string;
    updatedAt: string;
  };

  type UserEntity = {
    sub: string;
    email: string;
    name?: string;
    roles?: string[];
    picture?: string;
  };

  type UsersControllerDeleteTaskParams = {
    /** Task UUID */
    id: string;
  };

  type UsersControllerUpdateTaskParams = {
    /** Task UUID */
    id: string;
  };
}
