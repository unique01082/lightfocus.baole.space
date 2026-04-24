import { Outlet } from 'react-router';
import pk from '../../../package.json';
import Navbar from '../Navbar';

/**
 * Layout for public pages
 * Includes: Navbar and footer, but no SpaceCaptainChat
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

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
