import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthenticatedLayout, AuthLayout, MinimalLayout, PublicLayout } from './components/layouts';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { TaskProvider } from './contexts/TaskContext';
import AboutPage from './pages/AboutPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import AuthPage from './pages/AuthPage';
import BullseyePage from './pages/BullseyePage';
import CardsPage from './pages/CardsPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from './pages/SettingsPage';
import ShortcutsPage from './pages/ShortcutsPage';
import SolarSystem from './pages/SolarSystemPage';
import TaskListPage from './pages/TaskListPage';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth routes - minimal layout, no nav */}
              <Route element={<AuthLayout />}>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
              </Route>

              {/* Public routes - navbar + footer, no auth required */}
              <Route element={<PublicLayout />}>
                <Route path="/help" element={<HelpPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>

              {/* Minimal routes - no chrome at all */}
              <Route element={<MinimalLayout />}>
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Authenticated routes - full layout with nav, chat, footer */}
              <Route
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<SolarSystem />} />
                <Route path="/bullseye" element={<BullseyePage />} />
                <Route path="/tasks" element={<TaskListPage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/shortcuts" element={<ShortcutsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
