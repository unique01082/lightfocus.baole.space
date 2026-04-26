import { useLayoutEffect, useMemo, useRef } from 'react';
import type { TimelineEntry } from '../types';
import ActivityEntry from './ActivityEntry';
import ConversationEntry from './ConversationEntry';
import FeedbackEntry from './FeedbackEntry';
import SystemEventEntry from './SystemEventEntry';
import TimelineDateHeader from './TimelineDateHeader';

const BOTTOM_THRESHOLD_PX = 56;

interface ChatTimelineProps {
  timeline: TimelineEntry[];
  agentName: string;
  agentImage: string;
  captainName: string;
  onFeedbackRespond: (feedbackId: string, value: string) => void;
}

export default function ChatTimeline({
  timeline,
  agentName,
  agentImage,
  captainName,
  onFeedbackRespond,
}: ChatTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const shouldFollowBottomRef = useRef(true);
  const previousEntryCountRef = useRef(0);

  // Group timeline by date
  const groupedTimeline = useMemo(
    () => timeline.reduce((acc, entry) => {
      const date = entry.timestamp.toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {} as Record<string, TimelineEntry[]>),
    [timeline],
  );

  const updateFollowPreference = () => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const distanceToBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    shouldFollowBottomRef.current = distanceToBottom <= BOTTOM_THRESHOLD_PX;
  };

  useLayoutEffect(() => {
    const element = scrollContainerRef.current;
    if (!element || !shouldFollowBottomRef.current) {
      previousEntryCountRef.current = timeline.length;
      return;
    }

    const isFirstRender = previousEntryCountRef.current === 0;
    const hasNewEntry = timeline.length > previousEntryCountRef.current;

    element.scrollTo({
      top: element.scrollHeight,
      behavior: isFirstRender || !hasNewEntry ? 'auto' : 'smooth',
    });

    previousEntryCountRef.current = timeline.length;
  }, [timeline]);

  const renderTimelineEntry = (entry: TimelineEntry) => {
    switch (entry.type) {
      case 'conversation':
        return (
          <ConversationEntry
            key={entry.id}
            entry={entry}
            agentName={agentName}
            agentImage={agentImage}
            captainName={captainName}
          />
        );
      case 'user_activity':
        return <ActivityEntry key={entry.id} entry={entry} />;
      case 'system_event':
        return <SystemEventEntry key={entry.id} entry={entry} />;
      case 'feedback_request':
        return <FeedbackEntry key={entry.id} entry={entry} onRespond={onFeedbackRespond} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={updateFollowPreference}
      className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin relative z-10"
    >
      {Object.entries(groupedTimeline).map(([dateStr, entries]) => (
        <div key={dateStr} className="space-y-4">
          {/* Date Header */}
          <TimelineDateHeader dateStr={dateStr} />

          {/* Timeline Entries */}
          <div className="space-y-5">{entries.map((entry) => renderTimelineEntry(entry))}</div>
        </div>
      ))}

      {timeline.length === 0 && (
        <div className="flex items-center justify-center h-full text-indigo-400/40 text-sm font-mono">
          No timeline entries yet. Start a conversation with your AI companion...
        </div>
      )}
    </div>
  );
}
