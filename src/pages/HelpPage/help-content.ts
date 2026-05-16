export type HelpTab = 'guide' | 'features' | 'shortcuts' | 'faq';

export const TABS: { id: HelpTab; label: string; icon: string }[] = [
  { id: 'guide', label: 'Getting Started', icon: '🚀' },
  { id: 'features', label: 'Features', icon: '✨' },
  { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' },
  { id: 'faq', label: 'FAQ', icon: '💬' },
];

import faq from './content/faq.md?raw';
import features from './content/features.md?raw';
import guide from './content/guide.md?raw';
import shortcuts from './content/shortcuts.md?raw';

export const CONTENT: Record<HelpTab, string> = {
  guide,
  features,
  shortcuts,
  faq,
};
