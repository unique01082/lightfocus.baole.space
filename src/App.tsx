import { BrowserRouter, Route, Routes } from 'react-router';
import pk from '../package.json';
import './App.css';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import SpaceCaptainChat from './components/SpaceCaptainChat';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { TaskProvider } from './contexts/TaskContext';
import AuthCallbackPage from './pages/AuthCallbackPage';
import AuthPage from './pages/AuthPage';
import BullseyePage from './pages/BullseyePage';
import CardsPage from './pages/CardsPage';
import HelpPage from './pages/HelpPage';
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
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SolarSystem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bullseye"
              element={
                <ProtectedRoute>
                  <BullseyePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cards"
              element={
                <ProtectedRoute>
                  <CardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <HelpPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shortcuts"
              element={
                <ProtectedRoute>
                  <ShortcutsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>

          <SpaceCaptainChat />

          <footer className="nasa-footer">
            <div className="footer-content">
              <strong style={{ color: "var(--accent-1)" }}>LIGHT FOCUS</strong>
              {" "}
              - Task Manager v{pk.version}
            </div>
          </footer>
        </BrowserRouter>
      </TaskProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
