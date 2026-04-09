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

  if (user && userApproved) {
    return children;
  }

  return <Navigate to="/" replace />;
};

// ============================================
// PUBLIC ROUTES
// ============================================
const PublicRoute = ({ children }) => {
  const { user, userApproved, loading } = useAuth();

  if (loading) return null;

  if (user && userApproved) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* PROTECTED ROUTES */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>

        {/* ✅ FIX: Dashboard show hoga ab */}
        <Route index element={<Dashboard />} />

        {/* Internal pages */}
        <Route path="trades" element={<Trades />} />
        <Route path="positions" element={<Positions />} />
        <Route path="summary" element={<Summary />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}