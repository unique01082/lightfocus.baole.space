import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut, isConfigured } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-lg border-b border-purple-500/30 shadow-lg shadow-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl transform group-hover:scale-110 transition-transform duration-200">🪐</span>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent tracking-wide">LightFocus</span>
          </Link>

          <button
            className="md:hidden text-white hover:text-purple-300 transition-colors text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-16 md:top-0 left-0 right-0 flex-col md:flex-row items-center gap-1 md:gap-4 bg-purple-900/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-4 md:p-0 border-b md:border-0 border-purple-500/30`}>
            <Link
              to="/stats"
              className={`w-full md:w-auto text-center py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/stats'
                  ? 'bg-purple-600/50 text-white shadow-lg shadow-purple-500/30'
                  : 'text-purple-200 hover:bg-purple-700/30 hover:text-white'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              📊 Stats
            </Link>
            <Link
              to="/help"
              className={`w-full md:w-auto text-center px-2 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/help'
                  ? 'bg-purple-600/50 text-white shadow-lg shadow-purple-500/30'
                  : 'text-purple-200 hover:bg-purple-700/30 hover:text-white'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              ❓ Help
            </Link>

            <div className="hidden md:block w-px h-8 bg-purple-500/30 mx-2" />
            <div className="w-full md:w-auto h-px md:hidden bg-purple-500/30 my-2" />

            {user ? (
              <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 group"
                  onClick={() => setMenuOpen(false)}
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-purple-400/50 group-hover:border-purple-300 transition-colors" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-purple-200 font-medium group-hover:text-white transition-colors">{user.name}</span>
                </Link>
                <button
                  className="w-full md:w-auto px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30"
                  onClick={signOut}
                >
                  Sign out
                </button>
              </div>
            ) : isConfigured ? (
              <Link
                to="/auth"
                className="w-full md:w-auto text-center px-4 py-2 rounded-lg font-medium text-purple-200 hover:bg-purple-700/30 hover:text-white transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                🔐 Sign in
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
