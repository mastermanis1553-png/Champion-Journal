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
    <div className="w-full max-w-full overflow-x-hidden">
      <Routes>
        <Route path="/login" element={<div className="w-full max-w-full"><Login /></div>} />
        <Route path="/signup" element={<div className="w-full max-w-full"><Signup /></div>} />

        <Route path="/" element={
          <ProtectedRoute>
            <div className="w-full max-w-full">
              <Layout />
            </div>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          
          <Route path="dashboard" element={<div className="w-full max-w-full"><Dashboard /></div>} />
          <Route path="trades" element={<div className="w-full max-w-full"><Trades /></div>} />
          <Route path="positions" element={<div className="w-full max-w-full"><Positions /></div>} />
          <Route path="summary" element={<div className="w-full max-w-full"><Summary /></div>} />
          <Route path="diary" element={<div className="w-full max-w-full"><Diary /></div>} />
          <Route path="settings" element={<div className="w-full max-w-full"><Settings /></div>} />
          <Route path="help" element={<div className="w-full max-w-full"><Help /></div>} />
        </Route>
      </Routes>
    </div>
  );
}