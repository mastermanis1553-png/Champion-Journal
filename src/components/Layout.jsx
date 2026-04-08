import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import TradeForm from './TradeForm';
import { LogOut, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();

  const NavItem = ({ to, label }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => `px-5 py-5 text-sm font-bold border-b-2 transition-all duration-300 ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-800'}`}
    >
      {label}
    </NavLink>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f4f7f9] font-sans relative overflow-hidden">
      
      {/* BACKGROUND GLOW ORBS (Premium SaaS Effect) */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* GLASSMORPHISM NAVBAR */}
      <header className="relative z-20 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm flex items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
              <Activity size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase italic pr-4 border-r border-slate-200">
              R Trades
            </h1>
          </div>
          
          {/* NAVIGATION LINKS */}
          <nav className="flex space-x-2">
            <NavItem to="/dashboard" label="Dashboard" />
            <NavItem to="/trades" label="Trades" />
            <NavItem to="/positions" label="Positions" />
            <NavItem to="/summary" label="Matrix" />
            <NavItem to="/settings" label="Settings" />
            <NavItem to="/help" label="Help Guide" />
          </nav>
        </div>
        
        {/* RIGHT SIDE CONTROLS */}
        <div className="flex items-center space-x-5">
          <div className="bg-white/50 border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold text-slate-600 shadow-sm backdrop-blur-md">
            Market: <span className="text-blue-600">INDIA (NSE)</span>
          </div>
          <TradeForm />
          <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
            <LogOut size={18}/>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 overflow-auto p-8">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}