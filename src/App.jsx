import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- COMPONENTS & PAGES IMPORTS ---
import Layout from './components/Layout';
import Trades from './pages/Trades';
import Positions from './pages/Positions';
import Summary from './pages/Summary';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
// ... upar import mein add karo
import Help from './pages/Help';

// ... <Routes> ke andar add karo
<Route path="help" element={<Help />} />
// --- AUTH IMPORTS ---
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup'; // YAHAN SIGNUP IMPORT KIYA HAI
import { useAuth } from './context/AuthContext';

// --- PROTECTED ROUTE LOGIC ---
// Ye check karta hai ki user logged in hai ya nahi. Nahi hai toh Login pe bhej dega.
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* 🔴 PUBLIC ROUTES (Bina login ke khulne chahiye) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> {/* YAHAN SIGNUP KA ROUTE DAALA HAI */}

      {/* 🟢 PROTECTED ROUTES (Login ke baad Dashboard/Layout ke andar khulenge) */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Jaise hi koi / par aayega, use auto-redirect karke /trades par bhej denge */}
        <Route index element={<Navigate to="/trades" replace />} />
        
        {/* Tere saare internal pages */}
        <Route path="trades" element={<Trades />} />
        <Route path="positions" element={<Positions />} />
        <Route path="summary" element={<Summary />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}