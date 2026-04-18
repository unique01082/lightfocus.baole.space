import { useState } from 'react';
import { Link } from 'react-router';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsPage() {
  const { settings, updateSettings, availableImages } = useSettings();
  const [agentName, setAgentName] = useState(settings.agentName);

  const handleNameSave = () => {
    if (agentName.trim()) {
      updateSettings({ agentName: agentName.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
      <div className="max-w-2xl mx-auto mt-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-8 text-sm"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">⚙️ Settings</h1>

        {/* AI Agent Settings */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🤖 AI Agent Configuration
          </h2>

          {/* Agent Name */}
          <div className="space-y-2">
            <label className="text-sm text-purple-300/80 font-medium">Agent Name</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                maxLength={20}
                className="flex-1 bg-indigo-950/60 border border-indigo-500/30 rounded-xl px-4 py-2.5
                  text-white text-sm font-mono placeholder-indigo-500/50
                  focus:outline-none focus:border-indigo-400/60 focus:ring-1 focus:ring-indigo-400/30"
                placeholder="Enter agent name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                }}
              />
              <button
                onClick={handleNameSave}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold
                  rounded-xl transition-all border border-indigo-400/30"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-purple-400/60">Current: {settings.agentName}</p>
          </div>

          {/* Agent Image */}
          <div className="space-y-3">
            <label className="text-sm text-purple-300/80 font-medium">Agent Avatar</label>
            <div className="grid grid-cols-2 gap-4">
              {availableImages.map((img) => (
                <button
                  key={img}
                  onClick={() => updateSettings({ agentImage: img })}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 aspect-square
                    ${settings.agentImage === img
                      ? 'border-indigo-400 shadow-lg shadow-indigo-500/40 scale-[1.02]'
                      : 'border-white/10 hover:border-purple-400/50 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={img}
                    alt="AI Agent Avatar"
                    className="w-full h-full object-cover"
                  />
                  {settings.agentImage === img && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="border-t border-purple-500/20 pt-4">
            <label className="text-sm text-purple-300/80 font-medium mb-3 block">Preview</label>
            <div className="flex items-center gap-4 bg-indigo-950/40 rounded-xl p-4 border border-indigo-500/20">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-400/50 flex-shrink-0">
                <img
                  src={settings.agentImage}
                  alt={settings.agentName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-white font-bold font-mono">{settings.agentName}</div>
                <div className="text-indigo-300/60 text-xs font-mono">AI Navigation Assistant</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-300 text-xs font-mono">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
