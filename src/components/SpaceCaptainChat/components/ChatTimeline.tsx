import type { TimelineEntry } from '../types';
import ActivityEntry from './ActivityEntry';
import ConversationEntry from './ConversationEntry';
import FeedbackEntry from './FeedbackEntry';
import SystemEventEntry from './SystemEventEntry';
import TimelineDateHeader from './TimelineDateHeader';

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
  // Group timeline by date
  const groupedTimeline = timeline.reduce((acc, entry) => {
    const date = entry.timestamp.toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimelineEntry[]>);

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
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin relative z-10">
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
