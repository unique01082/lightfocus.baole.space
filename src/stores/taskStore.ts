import type { Task, Subtask } from '../types/task';

const STORAGE_KEY = 'lightfocus_tasks';

export function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

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
