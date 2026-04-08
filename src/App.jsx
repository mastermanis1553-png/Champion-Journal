import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- COMPONENTS & PAGES IMPORTS ---
import Layout from './components/Layout';
import Trades from './pages/Trades';
import Positions from './pages/Positions';
import Summary from './pages/Summary';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Help from './pages/Help';

// --- AUTH IMPORTS ---
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import { useAuth } from './context/AuthContext';

// ============================================
// PROTECTED ROUTE - Checks auth + approval
// ============================================
const ProtectedRoute = ({ children }) => {
  const { user, userApproved, loading } = useAuth();

  if (loading) return null;

  // Must be both logged in AND approved
  if (user && userApproved) {
    return children;
  }

  // Not authenticated or not approved - redirect to signup
  return <Navigate to="/" replace />;
};

// ============================================
// PUBLIC ROUTES - Redirect if already authenticated
// ============================================
const PublicRoute = ({ children }) => {
  const { user, userApproved, loading } = useAuth();

  if (loading) return null;

  // Already authenticated and approved - redirect to dashboard
  if (user && userApproved) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      {/* ============================================
          PUBLIC ROUTES (Default signup first)
          ============================================ */}
      <Route path="/" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* ============================================
          PROTECTED ROUTES (Dashboard & internal pages)
          ============================================ */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Auto-redirect /dashboard to /dashboard/trades */}
        <Route index element={<Navigate to="trades" replace />} />

        {/* All internal pages */}
        <Route path="trades" element={<Trades />} />
        <Route path="positions" element={<Positions />} />
        <Route path="summary" element={<Summary />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Catch-all - redirect unknown routes to signup */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}