// AI service — connects to the lightfocus-ai microservice
export const AI_URL = import.meta.env.VITE_AI_URL ?? 'http://localhost:3001';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface ChatHistoryMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export async function fetchChatHistory(limit = 50): Promise<ChatHistoryMessage[]> {
  const res = await fetch(`${AI_URL}/api/v1/chat/history?limit=${limit}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load chat history');
  const data: { messages: ChatHistoryMessage[] } = await res.json();
  return data.messages;
}

export async function clearChatHistory(): Promise<void> {
  const res = await fetch(`${AI_URL}/api/v1/chat`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to clear conversation');
}

export interface ActivityLogEntry {
  id: string;
  type: 'user_activity' | 'system_event' | 'feedback_request';
  eventType: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export async function fetchTimeline(limit = 50): Promise<ActivityLogEntry[]> {
  const res = await fetch(`${AI_URL}/api/v1/timeline?limit=${limit}`, {
    headers: authHeaders(),
  });
  if (!res.ok) return [];
  const data: { data: ActivityLogEntry[] } = await res.json();
  return data.data;
}

export function subscribeToTimeline(
  onEntry: (entry: ActivityLogEntry) => void,
  onError?: (err: Event) => void,
): () => void {
  const token = localStorage.getItem('token');
  const url = `${AI_URL}/api/v1/timeline/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  const es = new EventSource(url);

  es.onmessage = (e) => {
    try {
      const payload = JSON.parse(e.data) as { type: string } & ActivityLogEntry;
      if (payload.type !== 'connected' && payload.type !== 'heartbeat') {
        onEntry(payload as ActivityLogEntry);
      }
    } catch { /* ignore parse errors */ }
  };

  if (onError) es.onerror = onError;

  return () => es.close();
}

export async function submitFeedback(eventType: string, data: Record<string, unknown>): Promise<void> {
  await fetch(`${AI_URL}/api/v1/feedback`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ eventType, data }),
  });
}
