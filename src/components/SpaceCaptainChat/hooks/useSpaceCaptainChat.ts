import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, getToolName, isToolUIPart, type UIMessage } from 'ai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { AI_URL, clearChatHistory, fetchChatHistory } from '../../../services/ai';
import type { ConversationEntry, ToolCall } from '../types';

// ─── Map useChat messages to ConversationEntry ───────────────────────────────

function toConversationEntries(messages: UIMessage[]): ConversationEntry[] {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => {
      const toolCalls: ToolCall[] = m.parts
        .filter(isToolUIPart)
        .map((p) => ({
          name: getToolName(p),
          status: p.state === 'output-available' ? ('done' as const) : ('running' as const),
        }));

      const content = m.parts
        .filter((p) => p.type === 'text')
        .map((p) => p.text)
        .join('');

      const createdAt = (m.metadata as { createdAt?: string } | undefined)?.createdAt;

      return {
        id: m.id,
        type: 'conversation',
        role: m.role === 'user' ? 'captain' : 'agent',
        content,
        timestamp: createdAt ? new Date(createdAt) : new Date(),
        ...(toolCalls.length > 0 ? { toolCalls } : {}),
      } satisfies ConversationEntry;
    });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseSpaceCaptainChatReturn {
  conversationEntries: ConversationEntry[];
  isLoading: boolean;
  status: string;
  error: Error | undefined;
  input: string;
  setInput: (v: string) => void;
  sendMessage: (text: string) => void;
  clearConversation: () => void;
  stop: () => void;
  historyLoaded: boolean;
}

export function useSpaceCaptainChat(): UseSpaceCaptainChatReturn {
  const { settings } = useSettings();
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [input, setInput] = useState('');
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const { messages, setMessages, sendMessage: chatSendMessage, status, error, stop } = useChat({
    experimental_throttle: 50,
    transport: new DefaultChatTransport({
      api: `${AI_URL}/api/v1/chat`,
      headers: () => ({
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      }),
      // Send our backend's expected format instead of the default messages array
      prepareSendMessagesRequest: ({ messages: msgs }) => {
        const lastMsg = msgs.findLast((m) => m.role === 'user');
        const { agentName, agentPersonality } = settingsRef.current;
        const message = lastMsg?.parts
          .filter((p) => p.type === 'text')
          .map((p) => p.text)
          .join('') ?? '';

        return { body: { message, agentName, agentPersonality } };
      },
    }),
  });

  // Load conversation history from the backend on mount
  useEffect(() => {
    fetchChatHistory(50)
      .then((history) => {
        if (history.length > 0) {
          setMessages(
            history.map((m) => ({
              id: m.id,
              role: m.role,
              parts: [{ type: 'text' as const, text: m.content }],
              metadata: { createdAt: m.createdAt },
            })),
          );
        }
      })
      .catch(console.warn)
      .finally(() => setHistoryLoaded(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      chatSendMessage({ text });
    },
    [chatSendMessage],
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    clearChatHistory().catch(console.warn);
  }, [setMessages]);

  const conversationEntries = toConversationEntries(messages);

  return {
    conversationEntries,
    isLoading: status === 'submitted' || status === 'streaming',
    status,
    error,
    input,
    setInput,
    sendMessage,
    clearConversation,
    stop,
    historyLoaded,
  };
}
