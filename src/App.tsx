import { BrowserRouter, Route, Routes } from 'react-router';
import './App.legacy.css';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import AuthCallbackPage from './pages/AuthCallbackPage';
import AuthPage from './pages/AuthPage';
import HelpPage from './pages/HelpPage';
import SolarSystem from './pages/SolarSystemPage';
import TaskListPage from './pages/TaskListPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
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
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskListPage />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
