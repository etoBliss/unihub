import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import VerifyPending from './pages/VerifyPending';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Announcements from './pages/Announcements';
import Repository from './pages/Repository';
import Chat from './pages/Chat';
import Guide from './pages/Guide';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Authentication pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify-pending" element={<VerifyPending />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />

          {/* Secure App layouts */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="repository" element={<Repository />} />
            <Route path="chat" element={<Chat />} />
            <Route path="guide" element={<Guide />} />
          </Route>

          {/* Fallback routing redirects to landing page */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
