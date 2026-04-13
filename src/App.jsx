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
  const { user, userApproved, loading, logout } = useAuth();
  
  if (loading) return null;

  // 1. Agar login nahi hai toh seedha login page
  if (!user) return <Navigate to="/login" replace />;

  // 2. Agar login hai par Admin ne Approve nahi kiya
  if (!userApproved) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f7f8fc] text-[#494D5F] p-10 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#d0bdf4] max-w-sm">
          <h1 className="text-2xl font-bold text-rose-500 mb-2">Access Denied</h1>
          <p className="text-sm text-[#a28089] mb-6">
            Bhai, tera account abhi approved nahi hai. <br />
            Kripya approve karwane ke liye admin se baat karein.
          </p>
          <button 
            onClick={() => logout()} 
            className="w-full py-3 bg-[#8458B3] text-white rounded-xl font-bold hover:bg-[#6b4491] transition-all"
          >
            Logout to Home
          </button>
        </div>
      </div>
    );
  }

  // 3. Agar login hai aur approved hai
  return children;
};

export default function App() {
  return (
    <div className="w-full max-w-full overflow-hidden">
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