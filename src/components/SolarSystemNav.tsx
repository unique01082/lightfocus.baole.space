import { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="solar-nav">
      <button className="solar-nav-toggle" onClick={() => setExpanded(!expanded)}>
        ☰
      </button>
      {expanded && (
        <div className="solar-nav-menu">
          <Link to="/tasks" className="solar-nav-link">
            📋 Task List
          </Link>
          <Link to="/help" className="solar-nav-link">
            ❓ Help
          </Link>
          <a
            href="https://baole.space"
            className="solar-nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            🏠 baole.space
          </a>
          {user ? (
            <>
              <div className="solar-nav-user">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="nav-avatar-sm"
                  />
                ) : (
                  <div className="nav-avatar-placeholder-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{user.name}</span>
              </div>
              <button className="solar-nav-link" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : isConfigured ? (
            <Link to="/auth" className="solar-nav-link">
              🔐 Sign in
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
