interface TimelineDateHeaderProps {
  dateStr: string;
}

export default function TimelineDateHeader({ dateStr }: TimelineDateHeaderProps) {
  const getDateLabel = (dateStr: string) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (dateStr === today) return 'TODAY';
    if (dateStr === yesterday) return 'YESTERDAY';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="text-xs font-mono font-bold tracking-[0.3em] text-indigo-400/70 px-4 py-1.5 bg-indigo-950/40 border border-indigo-500/30 rounded-full">
        {getDateLabel(dateStr)}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
    </div>
  );
}
