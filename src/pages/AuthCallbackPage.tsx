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
    <div className="auth-page">
      <div className="auth-card">
        <div className="spinner" />
        <p style={{ marginTop: 16, opacity: 0.7 }}>Completing sign in…</p>
      </div>
    </div>
  );
}
