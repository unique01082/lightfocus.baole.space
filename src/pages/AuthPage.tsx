import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loading, signingIn, isConfigured, signIn } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-10 max-w-md w-full shadow-2xl shadow-purple-500/20 animate-in zoom-in duration-700">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-in zoom-in duration-1000" style={{ animationDelay: '200ms' }}>🪐</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-2 animate-in slide-in-from-bottom-3 duration-700" style={{ animationDelay: '400ms' }}>LightFocus</h1>
          <p className="text-purple-300 font-semibold tracking-wide animate-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: '600ms' }}>Bullseye Task Manager</p>
        </div>

        <p className="text-purple-200/80 text-center mb-8 leading-relaxed animate-in fade-in duration-700" style={{ animationDelay: '800ms' }}>
          Organize your tasks in a 3D solar system. The more important the task, the closer it orbits the sun.
        </p>

        {isConfigured ? (
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-in slide-in-from-bottom duration-700"
            style={{ animationDelay: '1000ms' }}
            onClick={signIn}
            disabled={loading || signingIn}
          >
            {signingIn ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              <>🔐 Sign in with SSO</>
            )}
          </button>
        ) : (
          <div className="text-center animate-in fade-in duration-700" style={{ animationDelay: '1000ms' }}>
            <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-xl p-4 mb-4">
              <p className="text-yellow-200 text-sm mb-3">Auth not configured. Running in local mode.</p>
            </div>
            <button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50"
              onClick={() => navigate('/')}
            >
              🚀 Launch LightFocus
            </button>
          </div>
        )}

        <div className="text-center mt-8 text-purple-300/70 text-sm animate-in fade-in duration-700" style={{ animationDelay: '1200ms' }}>
          Part of <a href="https://baole.space" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-200 underline transition-colors">baole.space</a>
        </div>
      </div>
    </div>
  );
}
