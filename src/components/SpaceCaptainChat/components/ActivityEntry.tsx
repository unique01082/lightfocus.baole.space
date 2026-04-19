import type { UserActivityEntry } from '../types';

interface ActivityEntryProps {
  entry: UserActivityEntry;
}

const actionIcons = {
  task_created: '📋',
  task_completed: '✅',
  subtask_added: '➕',
  subtask_completed: '☑️',
  priority_changed: '🔄',
  complexity_changed: '📊',
  due_date_changed: '📅',
};

const actionText = {
  task_created: 'created task',
  task_completed: 'completed task',
  subtask_added: 'added subtask',
  subtask_completed: 'completed subtask',
  priority_changed: 'changed priority',
  complexity_changed: 'changed complexity',
  due_date_changed: 'changed due date',
};

export default function ActivityEntry({ entry }: ActivityEntryProps) {
  return (
    <div className="flex items-start gap-3 py-2 justify-end">
      <div className="flex-1 text-right">
        <div className="text-sm text-slate-300">
          <span className="text-amber-400 font-semibold">You</span>{' '}
          <span className="text-slate-400">{actionText[entry.action]}</span>{' '}
          <span className="text-white font-semibold">"{entry.taskTitle}"</span>
          {entry.details?.subtask && (
            <span className="text-slate-400"> — {entry.details.subtask}</span>
          )}
          {entry.details?.from && entry.details?.to && (
            <span className="text-slate-400">
              {' '}
              from <span className="text-amber-300">{entry.details.from}</span> →{' '}
              <span className="text-green-300">{entry.details.to}</span>
            </span>
          )}
          {entry.details?.priority && (
            <span className="text-slate-400">
              {' '}
              (<span className="text-red-400">{entry.details.priority}</span>, complexity{' '}
              {entry.details.complexity})
            </span>
          )}
        </div>
        <div className="text-[10px] font-mono text-slate-600 mt-0.5">
          {entry.timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </div>
      </div>
      <div className="text-2xl flex-shrink-0">{actionIcons[entry.action]}</div>
    </div>
  );
}
