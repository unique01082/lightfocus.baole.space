import { Outlet } from 'react-router';
import pk from '../../../package.json';

/**
 * Minimal layout for authentication pages
 * No navigation or chat - clean authentication experience
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="nasa-footer">
        <div className="footer-content">
          <strong style={{ color: "var(--accent-1)" }}>LIGHT FOCUS</strong>
          {" "}
          - Task Manager v{pk.version}
        </div>
      </footer>
    </div>
  );
}
