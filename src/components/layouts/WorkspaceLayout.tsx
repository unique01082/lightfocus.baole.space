import { Outlet } from 'react-router';
import SpaceCaptainChat from '../SpaceCaptainChat';

/**
 * Layout for workspace pages — fullscreen app views with no header.
 * Includes: SpaceCaptainChat overlay only.
 * Use for: Solar System, Bullseye, Tasks, Cards.
 */
export default function WorkspaceLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
      <SpaceCaptainChat />
    </div>
  );
}
