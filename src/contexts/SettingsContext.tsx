import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const AI_AGENT_IMAGES = [
  '/images/ai_agent_images/471272582_10162293866099275_3729933063458741652_n.jpg',
  '/images/ai_agent_images/471301977_10162293865379275_3244412429220247913_n.jpg',
  '/images/ai_agent_images/471315159_10162293866239275_8100826200310024099_n.jpg',
  '/images/ai_agent_images/627385829_18110479237656336_8980509483731838600_n.jpg',
];

interface Settings {
  agentName: string;
  agentImage: string;
}

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  availableImages: string[];
}

const STORAGE_KEY = 'lightfocus-settings';

const DEFAULT_SETTINGS: Settings = {
  agentName: 'ARIA-7',
  agentImage: AI_AGENT_IMAGES[0],
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch { /* ignore */ }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, availableImages: AI_AGENT_IMAGES }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
