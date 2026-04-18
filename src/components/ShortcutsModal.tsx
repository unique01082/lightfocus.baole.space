import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ShortcutItem {
  key: string;
  description: string;
}

interface ShortcutSection {
  category: string;
  items: ShortcutItem[];
}

interface ShortcutsModalProps {
  shortcuts: ShortcutSection[];
  onClose: () => void;
}

export default function ShortcutsModal({ shortcuts, onClose }: ShortcutsModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backdropFilter: 'blur(8px)',
        background: 'rgba(0, 0, 0, 0.6)',
      }}
      onClick={onClose}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
    >
      <div
        className="bg-gradient-to-br from-purple-900/98 via-indigo-900/98 to-purple-900/98
          backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
          shadow-2xl shadow-purple-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">⌨️ Keyboard Shortcuts</h2>
          <button
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/20
              text-white transition-all"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {shortcuts.map((section) => (
            <div
              key={section.category}
              className="bg-black/20 rounded-xl p-4 border border-purple-400/20"
            >
              <h3 className="text-xl font-bold text-white mb-3">{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-purple-400/10 last:border-b-0"
                  >
                    <span className="text-purple-200 text-sm">{item.description}</span>
                    <kbd className="bg-purple-600/50 text-purple-100 px-3 py-1.5 rounded-lg font-mono text-xs border border-purple-400/30 shadow-inner whitespace-nowrap ml-4">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-br from-indigo-800/40 to-purple-800/40 rounded-xl p-4 border border-indigo-400/20">
            <h3 className="text-lg font-bold text-white mb-2">💡 Tips</h3>
            <ul className="space-y-1 text-purple-200/90 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">★</span>
                <span>In Solar System view, double-click a planet to follow it with the camera</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">★</span>
                <span>Completed tasks appear as asteroids in the outer belt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">★</span>
                <span>In Bullseye view, drag to pan and scroll to zoom</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
