import { useState } from 'react';
import { Link } from 'react-router';
import AgentConfigSection from './components/AgentConfigSection';
import FutureSection from './components/FutureSection';
import LanguageSection from './components/LanguageSection';
import MemoriesSection from './components/MemoriesSection';
import RankingConfigSection from './components/RankingConfigSection';
import UserProfileSection from './components/UserProfileSection';

type SettingsTab = 'agent' | 'profile' | 'ranking' | 'memory' | 'more';

const TABS: { id: SettingsTab; icon: string; label: string }[] = [
  { id: 'agent',   icon: '🤖', label: 'Agent'   },
  { id: 'profile', icon: '👤', label: 'Profile'  },
  { id: 'ranking', icon: '🎯', label: 'Ranking'  },
  { id: 'memory',  icon: '🧠', label: 'Memory'   },
  { id: 'more',    icon: '⚙️',  label: 'More'     },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('agent');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
      <div className="max-w-2xl mx-auto mt-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-6 text-sm"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-6">⚙️ Settings</h1>

        {/* Tab bar */}
        <div className="flex gap-1 bg-black/40 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-1.5 mb-6 overflow-x-auto scrollbar-thin">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-mono font-semibold
                whitespace-nowrap transition-all duration-200 flex-1 justify-center
                ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-purple-300/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-6">
          {activeTab === 'agent' && (
            <>
              <AgentConfigSection />
              <LanguageSection />
            </>
          )}

          {activeTab === 'profile' && (
            <UserProfileSection />
          )}

          {activeTab === 'ranking' && (
            <RankingConfigSection />
          )}

          {activeTab === 'memory' && (
            <MemoriesSection />
          )}

          {activeTab === 'more' && (
            <>
              <FutureSection
                icon="🔌"
                title="Connected Apps & Data Sources"
                description="Sync tasks and context from your favourite tools. ARIA-7 will use this to give smarter suggestions."
                items={[
                  { icon: '📅', label: 'Google Calendar', detail: 'Sync events & deadlines' },
                  { icon: '🗂', label: 'Notion', detail: 'Import pages & databases' },
                  { icon: '💬', label: 'Slack / Teams', detail: 'Activity context' },
                  { icon: '🐙', label: 'GitHub', detail: 'PR & issue tracking' },
                ]}
              />
              <FutureSection
                icon="⚡"
                title="Subscription & Tokens"
                description="Unlock more AI interactions and premium features with a subscription plan."
                items={[
                  { icon: '🆓', label: 'Free Plan', detail: '100 tokens / month' },
                  { icon: '🚀', label: 'Pro — $9/mo', detail: '5,000 tokens / month' },
                  { icon: '💎', label: 'Ultra — $29/mo', detail: 'Unlimited tokens' },
                  { icon: '🏢', label: 'Team', detail: 'Shared workspace + admin' },
                ]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
