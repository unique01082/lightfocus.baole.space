import { Outlet } from 'react-router';
import pk from '../../../package.json';
import Navbar from '../Navbar';
import SpaceCaptainChat from '../SpaceCaptainChat';

/**
 * Layout for authenticated pages with full features
 * Includes: Navbar, SpaceCaptainChat, and footer
 */
export default function AuthenticatedLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <SpaceCaptainChat />

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
