import { useLayoutEffect, useMemo, useRef, useState } from 'react';
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
  const [isNearBottom, setIsNearBottom] = useState(true);

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
    const nearBottom = distanceToBottom <= BOTTOM_THRESHOLD_PX;

    shouldFollowBottomRef.current = nearBottom;
    setIsNearBottom(nearBottom);
  };

  const scrollToLatest = () => {
    const element = scrollContainerRef.current;
    if (!element) return;

    shouldFollowBottomRef.current = true;
    setIsNearBottom(true);
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth',
    });
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

    setIsNearBottom(true);

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
    <div className="relative flex-1 min-h-0 z-10">
      <div
        ref={scrollContainerRef}
        onScroll={updateFollowPreference}
        className="h-full min-h-0 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin"
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

      {!isNearBottom && timeline.length > 0 && (
        <button
          type="button"
          onClick={scrollToLatest}
          className="absolute bottom-4 right-6 inline-flex items-center gap-1.5 rounded-full
            border border-indigo-300/40 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-indigo-100
            shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-200
            hover:border-indigo-300/70 hover:bg-indigo-900/90"
        >
          <span aria-hidden>↓</span>
          Jump to latest
        </button>
      )}
    </div>
  );
}
