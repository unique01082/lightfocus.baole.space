import { useRequest } from 'ahooks';
import { useState } from 'react';
import { type CommunicationStyle, type LearningStyle, type MotivationType, type UserProfile, type WorkSchedule } from '../../../contexts/SettingsContext';
import { memory } from '../../../services/lfai';

type SelectOption<T extends string> = { value: T | ''; label: string };

const WORK_SCHEDULE_OPTIONS: SelectOption<WorkSchedule>[] = [
  { value: '', label: '— Select —' },
  { value: 'early_bird', label: '🌅 Early bird (4–7 AM)' },
  { value: 'morning', label: '☀️ Morning person (7–10 AM)' },
  { value: 'afternoon', label: '🌤 Afternoon (10 AM–3 PM)' },
  { value: 'evening', label: '🌙 Evening (3–9 PM)' },
  { value: 'night_owl', label: '🦉 Night owl (9 PM+)' },
];

const MOTIVATION_OPTIONS: SelectOption<MotivationType>[] = [
  { value: '', label: '— Select —' },
  { value: 'achievement', label: '🏆 Achievement & milestones' },
  { value: 'progress', label: '📈 Steady progress' },
  { value: 'reward', label: '🎁 Rewards & incentives' },
  { value: 'deadline', label: '⏰ Deadlines & pressure' },
  { value: 'social', label: '👥 Social accountability' },
];

const COMMUNICATION_OPTIONS: SelectOption<CommunicationStyle>[] = [
  { value: '', label: '— Select —' },
  { value: 'casual', label: '😊 Casual & friendly' },
  { value: 'formal', label: '💼 Formal & professional' },
  { value: 'direct', label: '⚡ Direct & concise' },
  { value: 'detailed', label: '📖 Detailed & thorough' },
];

const LEARNING_OPTIONS: SelectOption<LearningStyle>[] = [
  { value: '', label: '— Select —' },
  { value: 'visual', label: '👁 Visual (diagrams, charts)' },
  { value: 'reading', label: '📚 Reading & writing' },
  { value: 'hands_on', label: '🔧 Hands-on practice' },
  { value: 'discussion', label: '💬 Discussion & reflection' },
];

function TextField({
  label,
  field,
  placeholder,
  multiline,
  value,
  onChange,
}: {
  label: string;
  field: keyof UserProfile;
  placeholder: string;
  multiline?: boolean;
  value: string;
  onChange: (field: keyof UserProfile, val: string) => void;
}) {
  const baseClass = `w-full bg-indigo-950/60 border border-indigo-500/30 rounded-xl px-4 py-2.5
    text-white text-sm font-mono placeholder-indigo-500/50
    focus:outline-none focus:border-indigo-400/60 focus:ring-1 focus:ring-indigo-400/30`;
  return (
    <div className="space-y-1">
      <label className="text-sm text-purple-300/80 font-medium">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(field, e.target.value)}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(field, e.target.value)}
          className={baseClass}
        />
      )}
    </div>
  );
}

function SelectField<T extends string>({
  label,
  field,
  options,
  value,
  onChange,
}: {
  label: string;
  field: keyof UserProfile;
  options: SelectOption<T>[];
  value: string;
  onChange: (field: keyof UserProfile, val: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-purple-300/80 font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full bg-indigo-950/60 border border-indigo-500/30 rounded-xl px-4 py-2.5
          text-white text-sm font-mono focus:outline-none focus:border-indigo-400/60 focus:ring-1 focus:ring-indigo-400/30"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function UserProfileSection() {
  const [localProfile, setLocalProfile] = useState<Partial<UserProfile>>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load profile from ARIA-7 memory on mount
  useRequest(() => memory.getMemory('profile'), {
    onSuccess: (data) => {
      if (data?.value && typeof data.value === 'object') {
        setLocalProfile(data.value as Partial<UserProfile>);
      }
      setLoading(false);
    },
    onError: () => setLoading(false),
  });

  const { run: syncProfile, loading: syncing } = useRequest(
    (profileData: Record<string, unknown>) => memory.upsertMemory('profile', profileData),
    {
      manual: true,
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      },
    },
  );

  const handleChange = (field: keyof UserProfile, val: string) => {
    setLocalProfile((prev) => ({ ...prev, [field]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    syncProfile(localProfile as Record<string, unknown>);
  };

  const str = (field: keyof UserProfile) => (localProfile[field] as string) ?? '';

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 space-y-5">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        👤 User Profile
      </h2>
      <p className="text-sm text-purple-300/60">
        Help ARIA-7 understand you better. This info is synced with her memory so she can give you more personalised support.
      </p>

      {loading ? (
        <p className="text-xs text-indigo-300/40 font-mono text-center py-8 animate-pulse">Loading profile…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Nickname" field="nickname" placeholder="What should ARIA-7 call you?" value={str('nickname')} onChange={handleChange} />
            <TextField label="Occupation / Role" field="job" placeholder="e.g. Software Engineer, Designer" value={str('job')} onChange={handleChange} />
            <SelectField label="Work Schedule" field="workSchedule" options={WORK_SCHEDULE_OPTIONS} value={str('workSchedule')} onChange={handleChange} />
            <SelectField label="Motivation Type" field="motivationType" options={MOTIVATION_OPTIONS} value={str('motivationType')} onChange={handleChange} />
            <SelectField label="Communication Style" field="communicationStyle" options={COMMUNICATION_OPTIONS} value={str('communicationStyle')} onChange={handleChange} />
            <SelectField label="Learning Style" field="learningStyle" options={LEARNING_OPTIONS} value={str('learningStyle')} onChange={handleChange} />
            <TextField label="Timezone" field="timezone" placeholder="e.g. Asia/Tokyo, UTC+7" value={str('timezone')} onChange={handleChange} />
          </div>

          <TextField label="Hobbies & Interests" field="hobbies" placeholder="Gaming, music, hiking, coffee..." value={str('hobbies')} onChange={handleChange} multiline />
          <TextField label="Goals & Targets" field="targets" placeholder="What are you working towards?" value={str('targets')} onChange={handleChange} multiline />
          <TextField label="Expectations from ARIA-7" field="expectations" placeholder="How can your AI companion help you best?" value={str('expectations')} onChange={handleChange} multiline />
          <TextField label="About Me" field="bio" placeholder="Anything else you'd like ARIA-7 to know..." value={str('bio')} onChange={handleChange} multiline />

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={syncing}
              className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all border
                ${saved
                  ? 'bg-green-700 border-green-500/40 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400/30 text-white'
                } disabled:opacity-50`}
            >
              {syncing ? 'Saving…' : saved ? '✓ Saved to ARIA-7' : 'Save Profile'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
