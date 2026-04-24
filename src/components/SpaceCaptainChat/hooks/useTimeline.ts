import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchTimeline,
  subscribeToTimeline,
  type ActivityLogEntry,
} from '../../../services/ai';
import type {
  UserActivityEntry,
  SystemEventEntry,
  FeedbackRequestEntry,
  TimelineEntry,
} from '../types';

// ─── Mapping helpers ──────────────────────────────────────────────────────────

type UserActivityAction = UserActivityEntry['action'];
const USER_ACTIVITY_ACTION_MAP: Record<string, UserActivityAction> = {
  task_created: 'task_created',
  task_completed: 'task_completed',
  subtask_created: 'subtask_added',
  subtask_completed: 'subtask_completed',
  task_priority_changed: 'priority_changed',
  task_complexity_changed: 'complexity_changed',
  task_due_date_changed: 'due_date_changed',
};

type SystemEventType = SystemEventEntry['eventType'];
const SYSTEM_EVENT_TYPE_MAP: Record<string, SystemEventType> = {
  morning_briefing: 'morning_briefing',
  deadline_reminder: 'deadline_reminder',
  burnout_warning: 'burnout_warning',
  momentum_update: 'momentum_update',
  habit_insight: 'habit_insight',
  task_completed: 'celebration',
  context_switch_alert: 'context_switch_alert',
};

const SEVERITY_MAP: Record<string, SystemEventEntry['severity']> = {
  burnout_warning: 'warning',
  deadline_reminder: 'warning',
  morning_briefing: 'info',
  celebration: 'success',
  context_switch_alert: 'warning',
};

type QuestionType = FeedbackRequestEntry['questionType'];

const FEEDBACK_QUESTION_MAP: Record<
  string,
  { questionType: QuestionType; question: string; options: FeedbackRequestEntry['options'] }
> = {
  end_of_day_checkin: {
    questionType: 'day_rating',
    question: 'How was your day overall?',
    options: [
      { label: 'Excellent', emoji: '🚀', value: 'excellent' },
      { label: 'Good', emoji: '✅', value: 'good' },
      { label: 'Okay', emoji: '😐', value: 'okay' },
      { label: 'Tough', emoji: '💪', value: 'tough' },
    ],
  },
  energy_check: {
    questionType: 'energy_level',
    question: 'How is your energy level right now?',
    options: [
      { label: 'High', emoji: '⚡', value: 'high' },
      { label: 'Medium', emoji: '🌤️', value: 'medium' },
      { label: 'Low', emoji: '😴', value: 'low' },
    ],
  },
};

function mapActivityToTimelineEntry(entry: ActivityLogEntry): TimelineEntry | null {
  const d = entry.data;
  const ts = new Date(entry.timestamp);

  if (entry.type === 'user_activity') {
    const action = USER_ACTIVITY_ACTION_MAP[entry.eventType];
    if (!action) return null;
    return {
      id: entry.id,
      type: 'user_activity',
      timestamp: ts,
      action,
      taskTitle: (d.taskTitle as string) ?? (d.title as string) ?? 'Task',
      taskId: (d.taskId as string) ?? (d.id as string) ?? '',
      details: {
        from: d.from as string,
        to: d.to as string,
        priority: d.priority as string,
        complexity: d.complexity as number,
        dueDate: d.dueDate as string,
        subtask: d.subtaskTitle as string,
      },
    } satisfies UserActivityEntry;
  }

  if (entry.type === 'system_event') {
    const eventType = SYSTEM_EVENT_TYPE_MAP[entry.eventType] ?? 'momentum_update';
    const severity = SEVERITY_MAP[eventType] ?? 'info';
    return {
      id: entry.id,
      type: 'system_event',
      timestamp: ts,
      eventType,
      severity,
      content: (d.message as string) ?? entry.eventType,
    } satisfies SystemEventEntry;
  }

  if (entry.type === 'feedback_request') {
    const template = FEEDBACK_QUESTION_MAP[entry.eventType];
    if (!template) return null;
    return {
      id: entry.id,
      type: 'feedback_request',
      timestamp: ts,
      ...template,
    } satisfies FeedbackRequestEntry;
  }

  return null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseTimelineReturn {
  nonChatEntries: TimelineEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTimeline(): UseTimelineReturn {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const seenIds = useRef<Set<string>>(new Set());

  const addEntry = useCallback((raw: ActivityLogEntry) => {
    if (seenIds.current.has(raw.id)) return;
    const mapped = mapActivityToTimelineEntry(raw);
    if (mapped) {
      seenIds.current.add(raw.id);
      setEntries((prev) => [...prev, mapped].sort((a, b) => +a.timestamp - +b.timestamp));
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await fetchTimeline(50);
      seenIds.current = new Set();
      const mapped = raw.flatMap((e) => {
        const m = mapActivityToTimelineEntry(e);
        if (m) { seenIds.current.add(e.id); return [m]; }
        return [];
      });
      setEntries(mapped.sort((a, b) => +a.timestamp - +b.timestamp));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeToTimeline(addEntry);
    return unsub;
  }, [load, addEntry]);

  return { nonChatEntries: entries, loading, error, refresh: load };
}
