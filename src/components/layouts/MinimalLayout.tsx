import { Outlet } from 'react-router';

/**
 * Minimal layout with no navigation, chat, or footer
 * Useful for: landing pages, error pages, fullscreen experiences
 */
export default function MinimalLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
