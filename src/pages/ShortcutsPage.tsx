
export default function ShortcutsPage() {
  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { key: 'H', description: 'Toggle UI visibility in Solar System view' },
        { key: 'L', description: 'Toggle planet labels' },
        { key: 'M', description: 'Toggle moon labels' },
        { key: 'O', description: 'Toggle orbit lines' },
        { key: 'Space', description: 'Pause/Resume animation' },
        { key: 'Esc', description: 'Stop following planet' },
      ],
    },
    {
      category: 'Task Management',
      items: [
        { key: 'N', description: 'Create new task' },
        { key: 'Click Planet', description: 'View task details' },
        { key: 'Double Click Planet', description: 'Follow planet' },
      ],
    },
    {
      category: 'View Modes',
      items: [
        { key: '1', description: 'Switch to 3D Solar System view' },
        { key: '2', description: 'Switch to Bullseye 2D view' },
        { key: '3', description: 'Switch to Cards view' },
        { key: '4', description: 'Switch to List view' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
      <div className="max-w-4xl mx-auto mt-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⌨️ Keyboard Shortcuts</h1>
          <p className="text-purple-200/70">Master Light Focus with these keyboard shortcuts</p>
        </div>

        <div className="space-y-6">
          {shortcuts.map((section) => (
            <div
              key={section.category}
              className="bg-gradient-to-br from-purple-800/40 via-indigo-800/40 to-purple-800/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-lg shadow-purple-500/10"
            >
              <h2 className="text-2xl font-bold text-white mb-4">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-purple-400/20 last:border-b-0"
                  >
                    <span className="text-purple-200">{item.description}</span>
                    <kbd className="bg-purple-600/50 text-purple-100 px-3 py-1.5 rounded-lg font-mono text-sm border border-purple-400/30 shadow-inner">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-br from-indigo-800/40 via-purple-800/40 to-indigo-800/40 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-6 shadow-lg shadow-indigo-500/10">
          <h2 className="text-xl font-bold text-white mb-3">💡 Tips</h2>
          <ul className="space-y-2 text-purple-200/90">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">★</span>
              <span>In Solar System view, double-click a planet to follow it with the camera</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">★</span>
              <span>Completed tasks appear as asteroids in the outer belt</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">★</span>
              <span>Task priority and complexity determine orbital position and planet size</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">★</span>
              <span>Subtasks orbit around their parent task like moons</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
