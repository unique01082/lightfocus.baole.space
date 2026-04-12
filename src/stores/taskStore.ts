import type { Task, Subtask } from '../types/task';
import { tasks as tasksApi, subtasks as subtasksApi } from '../services/lf';
import type { LF } from '../services/lf';

/**
 * Task Store - Server-side persistence
 * 
 * All task data is now stored on the server via API calls.
 * localStorage is no longer used for task persistence.
 */

// ============================================================================
// API Integration Functions
// ============================================================================

export async function loadTasks(): Promise<Task[]> {
  try {
    const response = await tasksApi.tasksControllerFindAll({ 
      limit: 1000,
      offset: 0 
    });
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to load tasks from server:', error);
    return [];
  }
}

export async function createTaskOnServer(partial: Partial<Task>): Promise<Task | null> {
  try {
    const taskData: LF.CreateTaskDto = {
      title: partial.title || 'New Task',
      description: partial.description || '',
      priority: partial.priority || 'medium',
      complexity: partial.complexity || 3,
      dueDate: partial.dueDate ?? undefined,
      color: partial.color || getRandomColor(),
    };
    
    // Response interceptor already extracts data from axios response
    const response = await tasksApi.tasksControllerCreate(taskData);
    return response as unknown as Task;
  } catch (error) {
    console.error('Failed to create task:', error);
    return null;
  }
}

export async function updateTaskOnServer(taskId: string, updates: Partial<Task>): Promise<Task | null> {
  try {
    const updateData: LF.UpdateTaskDto = {
      title: updates.title,
      description: updates.description,
      priority: updates.priority,
      complexity: updates.complexity,
      dueDate: updates.dueDate ?? undefined,
      completed: updates.completed,
      color: updates.color,
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof LF.UpdateTaskDto] === undefined) {
        delete updateData[key as keyof LF.UpdateTaskDto];
      }
    });
    
    const response = await tasksApi.tasksControllerUpdate(
      { id: taskId },
      updateData
    );
    return response as unknown as Task;
  } catch (error) {
    console.error('Failed to update task:', error);
    return null;
  }
}

export async function deleteTaskFromServer(taskId: string): Promise<boolean> {
  try {
    await tasksApi.tasksControllerRemove({ id: taskId });
    return true;
  } catch (error) {
    console.error('Failed to delete task:', error);
    return false;
  }
}

export async function createSubtaskOnServer(taskId: string, title: string): Promise<Subtask | null> {
  try {
    const subtaskData: LF.CreateSubtaskDto = {
      title: title.trim(),
    };
    
    const response = await subtasksApi.subtasksControllerCreate(
      { taskId },
      subtaskData
    );
    return response as unknown as Subtask;
  } catch (error) {
    console.error('Failed to create subtask:', error);
    return null;
  }
}

export async function updateSubtaskOnServer(
  taskId: string,
  subtaskId: string,
  updates: Partial<Subtask>
): Promise<Subtask | null> {
  try {
    const updateData: LF.UpdateSubtaskDto = {
      title: updates.title,
      completed: updates.completed,
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof LF.UpdateSubtaskDto] === undefined) {
        delete updateData[key as keyof LF.UpdateSubtaskDto];
      }
    });
    
    const response = await subtasksApi.subtasksControllerUpdate(
      { id: subtaskId, taskId },
      updateData
    );
    return response as unknown as Subtask;
  } catch (error) {
    console.error('Failed to update subtask:', error);
    return null;
  }
}

// ============================================================================
// Utility Functions (kept for local use)
// ============================================================================

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

const PLANET_COLORS = [
  '#4cc9f0', '#7209b7', '#f77f00', '#2a9d8f',
  '#e63946', '#457b9d', '#e9c46a', '#264653',
  '#ff6b6b', '#48bfe3', '#72efdd', '#ffd166',
];

export function getRandomColor(): string {
  return PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)];
}

// Legacy local functions - deprecated
export function createTask(partial: Partial<Task>): Task {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: partial.title || 'New Task',
    description: partial.description || '',
    priority: partial.priority || 'medium',
    complexity: partial.complexity || 3,
    dueDate: partial.dueDate || null,
    completed: false,
    subtasks: partial.subtasks || [],
    color: partial.color || getRandomColor(),
    createdAt: now,
    updatedAt: now,
  };
}

export function createSubtask(title: string): Subtask {
  return {
    id: generateId(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}
