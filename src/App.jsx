import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// IMPORTS
import Layout from './components/Layout';
import Trades from './pages/Trades';
import Positions from './pages/Positions';
import Summary from './pages/Summary';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Diary from './pages/Diary';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="trades" element={<Trades />} />
        <Route path="positions" element={<Positions />} />
        <Route path="summary" element={<Summary />} />
        <Route path="diary" element={<Diary />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Routes>
  );
}