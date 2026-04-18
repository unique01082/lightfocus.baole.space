import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { userManager } from '../services/oidc';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userManager) {
      navigate('/', { replace: true });
      return;
    }
    userManager
      .signinRedirectCallback()
      .then(() => navigate('/', { replace: true }))
      .catch((err) => {
        console.error('Auth callback error:', err);
        navigate('/auth', { replace: true });
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-10 max-w-md w-full shadow-2xl shadow-purple-500/20">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
        <p className="text-center text-purple-200/70 mt-4">Completing sign in…</p>
      </div>
    </div>
  );
}
