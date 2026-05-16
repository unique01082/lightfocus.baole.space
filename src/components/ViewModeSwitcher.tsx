import { useBoolean, useCreation, useKeyPress, useMemoizedFn } from 'ahooks';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import ShortcutsModal from './ShortcutsModal';
import RadioGroup from './ui/RadioGroup';

const VIEW_MODES = [
  { value: '/', label: 'Solar System', icon: '🪐' },
  { value: '/bullseye', label: 'Bullseye', icon: '🎯' },
  { value: '/cards', label: 'Cards View', icon: '📇' },
  { value: '/tasks', label: 'List View', icon: '📋' },
];

const ROUTE_THEMES = {
  '/': {
    radioActive: 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-500/30',
    radioInactive: 'text-cyan-200 hover:bg-cyan-800/40 hover:text-white',
    radioBorder: 'border-cyan-400/30',
    menuBtnGrad: 'from-cyan-700/90 to-slate-800/90',
    menuBtnShadow: 'shadow-cyan-500/30 hover:shadow-cyan-500/50',
    menuBtnBorder: 'border-cyan-400/30',
    dropdownBg: 'from-slate-900/95 via-cyan-950/95 to-slate-900/95',
    dropdownBorder: 'border-cyan-400/30',
    dropdownShadow: 'shadow-cyan-500/20',
    dropdownItem: 'text-cyan-200 hover:bg-cyan-700/40 hover:text-white',
    dropdownDivider: 'border-cyan-500/30',
  },
  '/bullseye': {
    radioActive: 'bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-500/30',
    radioInactive: 'text-amber-200 hover:bg-amber-800/40 hover:text-white',
    radioBorder: 'border-amber-400/30',
    menuBtnGrad: 'from-amber-700/90 to-slate-800/90',
    menuBtnShadow: 'shadow-amber-500/30 hover:shadow-amber-500/50',
    menuBtnBorder: 'border-amber-400/30',
    dropdownBg: 'from-slate-900/95 via-amber-950/95 to-slate-900/95',
    dropdownBorder: 'border-amber-400/30',
    dropdownShadow: 'shadow-amber-500/20',
    dropdownItem: 'text-amber-200 hover:bg-amber-700/40 hover:text-white',
    dropdownDivider: 'border-amber-500/30',
  },
  '/cards': {
    radioActive: 'bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-lg shadow-emerald-500/30',
    radioInactive: 'text-emerald-200 hover:bg-emerald-800/40 hover:text-white',
    radioBorder: 'border-emerald-400/30',
    menuBtnGrad: 'from-emerald-700/90 to-slate-800/90',
    menuBtnShadow: 'shadow-emerald-500/30 hover:shadow-emerald-500/50',
    menuBtnBorder: 'border-emerald-400/30',
    dropdownBg: 'from-slate-900/95 via-emerald-950/95 to-slate-900/95',
    dropdownBorder: 'border-emerald-400/30',
    dropdownShadow: 'shadow-emerald-500/20',
    dropdownItem: 'text-emerald-200 hover:bg-emerald-700/40 hover:text-white',
    dropdownDivider: 'border-emerald-500/30',
  },
  '/tasks': {
    radioActive: 'bg-gradient-to-br from-blue-600 to-sky-700 text-white shadow-lg shadow-blue-500/30',
    radioInactive: 'text-blue-200 hover:bg-blue-800/40 hover:text-white',
    radioBorder: 'border-blue-400/30',
    menuBtnGrad: 'from-blue-700/90 to-slate-800/90',
    menuBtnShadow: 'shadow-blue-500/30 hover:shadow-blue-500/50',
    menuBtnBorder: 'border-blue-400/30',
    dropdownBg: 'from-slate-900/95 via-blue-950/95 to-slate-900/95',
    dropdownBorder: 'border-blue-400/30',
    dropdownShadow: 'shadow-blue-500/20',
    dropdownItem: 'text-blue-200 hover:bg-blue-700/40 hover:text-white',
    dropdownDivider: 'border-blue-500/30',
  },
};

const DEFAULT_THEME = {
  radioActive: 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30',
  radioInactive: 'text-purple-200 hover:bg-purple-700/30 hover:text-white',
  radioBorder: 'border-purple-400/30',
  menuBtnGrad: 'from-purple-600/90 to-indigo-600/90',
  menuBtnShadow: 'shadow-purple-500/30 hover:shadow-purple-500/50',
  menuBtnBorder: 'border-purple-400/30',
  dropdownBg: 'from-purple-900/95 via-indigo-900/95 to-purple-900/95',
  dropdownBorder: 'border-purple-400/30',
  dropdownShadow: 'shadow-purple-500/20',
  dropdownItem: 'text-purple-200 hover:bg-purple-700/50 hover:text-white',
  dropdownDivider: 'border-purple-500/30',
};

export default function ViewModeSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isConfigured, signOut } = useAuth();
  const [menuOpen, { toggle: toggleMenuOpen, setFalse: closeMenu }] = useBoolean(false);
  const [showShortcuts, { setTrue: openShortcuts, setFalse: closeShortcuts }] = useBoolean(false);

  useKeyPress('esc', () => {
    if (showShortcuts) {
      closeShortcuts();
      return;
    }
    if (menuOpen) {
      closeMenu();
    }
  });

  const shortcuts = useCreation(
    () => [
      {
        category: 'Navigation',
        items: [
          { key: 'H', description: 'Toggle UI visibility in Solar System view' },
          { key: 'L', description: 'Toggle planet labels' },
          { key: 'M', description: 'Toggle moon labels' },
          { key: 'O', description: 'Toggle orbit lines' },
          { key: 'Space', description: 'Pause/Resume animation' },
          { key: 'Esc', description: 'Stop following planet / Close modal' },
          { key: '?', description: 'Show/Hide shortcuts modal' },
          { key: 'R', description: 'Reset camera view' },
          { key: 'F', description: 'Toggle fullscreen' },
        ],
      },
      {
        category: 'Task Management',
        items: [
          { key: 'N', description: 'Create new task' },
          { key: 'Click Planet', description: 'View task details' },
          { key: 'Double Click Planet', description: 'Follow planet' },
          { key: 'Enter', description: 'Edit selected task' },
          { key: 'Delete', description: 'Delete selected task' },
          { key: 'C', description: 'Toggle task completion' },
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
      {
        category: 'Bullseye Controls',
        items: [
          { key: 'Drag', description: 'Pan the view' },
          { key: 'Scroll', description: 'Zoom in/out' },
          { key: 'Reset Button', description: 'Reset pan and zoom' },
        ],
      },
      {
        category: 'Solar System Camera',
        items: [
          { key: '+/-', description: 'Zoom in/out' },
          { key: 'Arrow Keys', description: 'Rotate camera view' },
          { key: 'Mouse Drag', description: 'Rotate camera' },
          { key: 'Right Click + Drag', description: 'Pan camera' },
          { key: 'Middle Click + Drag', description: 'Zoom camera' },
        ],
      },
    ],
    [],
  );

  const handleSignOut = useMemoizedFn(() => {
    signOut();
    closeMenu();
  });

  const theme = ROUTE_THEMES[location.pathname as keyof typeof ROUTE_THEMES] ?? DEFAULT_THEME;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[999] flex items-center gap-3">
      <RadioGroup
        options={VIEW_MODES}
        value={location.pathname}
        onChange={(value) => navigate(value)}
        activeClass={theme.radioActive}
        inactiveClass={theme.radioInactive}
        containerClass={theme.radioBorder}
      />

      <div className="relative">
        <button
          className={`bg-gradient-to-br ${theme.menuBtnGrad} backdrop-blur-xl text-white w-10 h-10 rounded-full shadow-lg ${theme.menuBtnShadow} hover:scale-110 transition-all duration-300 border ${theme.menuBtnBorder} text-lg font-bold flex items-center justify-center`}
          onClick={toggleMenuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {menuOpen && (
          <div className={`absolute top-12 right-0 bg-gradient-to-br ${theme.dropdownBg} backdrop-blur-xl rounded-2xl shadow-2xl ${theme.dropdownShadow} border ${theme.dropdownBorder} py-2 min-w-[200px] animate-in slide-in-from-top-2 fade-in duration-300`}>
            <Link
              to="/help"
              className={`block px-4 py-2.5 ${theme.dropdownItem} transition-all duration-200 font-medium`}
              onClick={closeMenu}
            >
              ❓ Help
            </Link>
            <button
              className={`block w-full text-left px-4 py-2.5 ${theme.dropdownItem} transition-all duration-200 font-medium`}
              onClick={() => {
                openShortcuts();
                closeMenu();
              }}
            >
              ⌨️ Shortcuts
            </button>
            <a
              href="https://baole.space"
              className={`block px-4 py-2.5 ${theme.dropdownItem} transition-all duration-200 font-medium`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🏠 baole.space
            </a>
            <Link
              to="/settings"
              className={`block px-4 py-2.5 ${theme.dropdownItem} transition-all duration-200 font-medium`}
              onClick={closeMenu}
            >
              ⚙️ Settings
            </Link>
            {user ? (
              <>
                <div className={`px-4 py-2.5 border-t ${theme.dropdownDivider} mt-2 pt-3`}>
                  <div className="flex items-center gap-2 mb-2">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className={`w-7 h-7 rounded-full border-2 ${theme.menuBtnBorder}`}
                      />
                    ) : (
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${theme.menuBtnGrad} flex items-center justify-center text-white font-bold text-xs`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className={`${theme.dropdownItem.split(' ')[0]} text-sm font-medium`}>{user.name}</span>
                  </div>
                </div>
                <button
                  className="block w-full px-4 py-2.5 text-left text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all duration-200 font-medium"
                  onClick={handleSignOut}
                >
                  🚪 Sign out
                </button>
              </>
            ) : isConfigured ? (
              <Link
                to="/auth"
                className={`block px-4 py-2.5 ${theme.dropdownItem} transition-all duration-200 font-medium border-t ${theme.dropdownDivider} mt-2 pt-3`}
                onClick={closeMenu}
              >
                🔐 Sign in
              </Link>
            ) : null}
          </div>
        )}
      </div>

      {/* Shortcuts Modal via Portal */}
      {showShortcuts && (
        <ShortcutsModal shortcuts={shortcuts} onClose={closeShortcuts} />
      )}
    </div>
  );
}
