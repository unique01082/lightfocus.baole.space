import { useSettings } from '../../../contexts/SettingsContext';

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
];

export default function LanguageSection() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        🌐 Preferred Language
      </h2>
      <p className="text-sm text-purple-300/60">
        ARIA-7 will use this language when communicating with you.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.value}
            onClick={() => updateSettings({ language: lang.value })}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 text-left
              ${settings.language === lang.value
                ? 'border-indigo-400 bg-indigo-900/50 shadow-lg shadow-indigo-500/20'
                : 'border-white/10 hover:border-purple-400/40 bg-black/20'
              }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm font-mono text-white/80 truncate">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
