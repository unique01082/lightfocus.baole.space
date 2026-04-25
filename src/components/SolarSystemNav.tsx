import { useBoolean } from 'ahooks';
import { Link } from "react-router";

interface SolarSystemNavProps {
  user: { name: string; avatarUrl?: string } | null;
  isConfigured: boolean;
  signOut: () => Promise<void>;
}

export default function SolarSystemNav({
  user,
  isConfigured,
  signOut,
}: SolarSystemNavProps) {
  const [expanded, { toggle: toggleExpanded, setFalse: closeExpanded }] = useBoolean(false);

  return (
    <div className="fixed top-4 right-4 z-[1000]">
      <button
        className="bg-gradient-to-br from-purple-600/90 to-indigo-600/90 backdrop-blur-xl text-white w-12 h-12 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 border border-purple-400/30 text-xl font-bold flex items-center justify-center"
        onClick={toggleExpanded}
      >
        {expanded ? '✕' : '☰'}
      </button>
      {expanded && (
        <div className="absolute top-14 right-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/20 border border-purple-400/30 py-2 min-w-[200px] animate-in slide-in-from-top-2 fade-in duration-300">
          <Link
            to="/tasks"
            className="block px-4 py-2.5 text-purple-200 hover:bg-purple-700/50 hover:text-white transition-all duration-200 font-medium"
            onClick={closeExpanded}
          >
            📋 Task List
          </Link>
          <Link
            to="/bullseye"
            className="block px-4 py-2.5 text-purple-200 hover:bg-purple-700/50 hover:text-white transition-all duration-200 font-medium"
            onClick={closeExpanded}
          >
            🎯 Bullseye
          </Link>
          <Link
            to="/cards"
            className="block px-4 py-2.5 text-purple-200 hover:bg-purple-700/50 hover:text-white transition-all duration-200 font-medium"
            onClick={closeExpanded}
          >
            🃏 Cards
          </Link>
          <Link
            to="/stats"
            className="block px-4 py-2.5 text-purple-200 hover:bg-purple-700/50 hover:text-white transition-all duration-200 font-medium"
            onClick={closeExpanded}
          >
            📊 Stats
          </Link>
          <div className="h-px bg-purple-500/30 my-1" />
          <Link
            to="/profile"
            className="block px-4 py-2.5 text-purple-200 hover:bg-purple-700/50 hover:text-white transition-all duration-200 font-medium"
            onClick={closeExpanded}
          >
            👤 Profile
          </Link>
          <Link
            to="/help"
            className="block px-4 py-2.5 text-purple-200 hover:bg-purple-700/50 hover:text-white transition-all duration-200 font-medium"
            onClick={closeExpanded}
          >
            ❓ Help
          </Link>
          <a
            href="https://baole.space"
            className="block px-4 py-2.5 text-purple-200 hover:bg-purple-700/50 hover:text-white transition-all duration-200 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            🏠 baole.space
          </a>
          {user ? (
            <>
              <div className="px-4 py-2.5 border-t border-purple-500/30 mt-2 pt-3">
                <div className="flex items-center gap-2 mb-2">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-full border-2 border-purple-400/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-purple-200 text-sm font-medium">{user.name}</span>
                </div>
              </div>
              <button
                className="block w-full px-4 py-2.5 text-left text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all duration-200 font-medium"
                onClick={signOut}
              >
                🚪 Sign out
              </button>
            </>
          ) : isConfigured ? (
            <Link
              to="/auth"
              className="block px-4 py-2.5 text-purple-200 hover:bg-purple-700/50 hover:text-white transition-all duration-200 font-medium border-t border-purple-500/30 mt-2 pt-3"
              onClick={closeExpanded}
            >
              🔐 Sign in
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
