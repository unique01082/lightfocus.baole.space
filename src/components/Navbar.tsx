import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import SolarSystemNav from './SolarSystemNav';

export default function Navbar() {
  const { user, signOut, isConfigured } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Don't show navbar on auth pages or solar system (has its own UI)
  if (location.pathname === '/auth' || location.pathname === '/auth/callback') {
    return null;
  }
  // On solar system page, show a minimal floating nav
  if (location.pathname === '/') {
    return <SolarSystemNav user={user} isConfigured={isConfigured} signOut={signOut} />;
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🪐</span>
          <span className="brand-text">LightFocus</span>
        </Link>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            🪐 Solar System
          </Link>
          <Link to="/tasks" className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            📋 Task List
          </Link>
          <Link to="/help" className={`nav-link ${location.pathname === '/help' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            ❓ Help
          </Link>

          <div className="nav-separator" />

          {user ? (
            <div className="nav-user">
              <div className="nav-user-info">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="nav-avatar" />
                ) : (
                  <div className="nav-avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
                )}
                <span className="nav-username">{user.name}</span>
              </div>
              <button className="nav-signout" onClick={signOut}>Sign out</button>
            </div>
          ) : isConfigured ? (
            <Link to="/auth" className="nav-link" onClick={() => setMenuOpen(false)}>
              🔐 Sign in
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
