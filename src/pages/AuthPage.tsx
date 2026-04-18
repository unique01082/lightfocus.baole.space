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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🪐</span>
          <h1>LightFocus</h1>
          <p className="auth-subtitle">Bullseye Task Manager</p>
        </div>
        <p className="auth-desc">
          Organize your tasks in a 3D solar system. The more important the task, the closer it orbits the sun.
        </p>
        {isConfigured ? (
          <button
            className="auth-btn"
            onClick={signIn}
            disabled={loading || signingIn}
          >
            {signingIn ? (
              <span className="spinner" />
            ) : (
              <>🔐 Sign in with SSO</>
            )}
          </button>
        ) : (
          <div className="auth-local-notice">
            <p>Auth not configured. Running in local mode.</p>
            <button className="auth-btn" onClick={() => navigate('/')}>
              🚀 Launch LightFocus
            </button>
          </div>
        )}
        <div className="auth-footer-link">
          Part of <a href="https://baole.space" target="_blank" rel="noopener noreferrer">baole.space</a>
        </div>
      </div>
      <div className="auth-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
    </div>
  );
}
