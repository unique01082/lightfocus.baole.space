// Timeline Entry Types
export type TimelineEntryType = 'conversation' | 'user_activity' | 'system_event' | 'feedback_request';

export interface BaseTimelineEntry {
  id: string;
  type: TimelineEntryType;
  timestamp: Date;
}

export interface ConversationEntry extends BaseTimelineEntry {
  type: 'conversation';
  role: 'captain' | 'agent';
  content: string;
  toolCalls?: ToolCall[];
}

export interface UserActivityEntry extends BaseTimelineEntry {
  type: 'user_activity';
  action: 'task_created' | 'task_completed' | 'subtask_added' | 'subtask_completed' | 'priority_changed' | 'complexity_changed' | 'due_date_changed';
  taskTitle: string;
  taskId: string;
  details?: {
    subtask?: string;
    from?: string;
    to?: string;
    priority?: string;
    complexity?: number;
    dueDate?: string;
    estimatedTime?: string;
    actualTime?: string;
  };
}

export interface SystemEventEntry extends BaseTimelineEntry {
  type: 'system_event';
  eventType: 'morning_briefing' | 'deadline_reminder' | 'burnout_warning' | 'momentum_update' | 'habit_insight' | 'celebration' | 'context_switch_alert';
  severity: 'info' | 'warning' | 'critical' | 'success';
  content: string;
  actions?: { label: string; emoji: string }[];
}

export interface FeedbackRequestEntry extends BaseTimelineEntry {
  type: 'feedback_request';
  question: string;
  questionType: 'energy_level' | 'mood' | 'day_rating' | 'stress_level';
  options: { label: string; emoji: string; value: string }[];
  responded?: { value: string; respondedAt: Date };
}

export type TimelineEntry = ConversationEntry | UserActivityEntry | SystemEventEntry | FeedbackRequestEntry;

export interface ToolCall {
  name: string;
  status: 'running' | 'done';
}
