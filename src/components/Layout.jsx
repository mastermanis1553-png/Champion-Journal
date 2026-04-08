import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import TradeForm from './TradeForm';
import { LogOut, Activity, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ to, label, isMobile }) => (
    <NavLink 
      to={to} 
      onClick={() => isMobile && setMobileMenuOpen(false)}
      className={({ isActive }) => `font-bold transition-all duration-300 ${isMobile ? 'block py-3 px-4 rounded-lg text-base' : 'px-4 py-5 text-sm border-b-2'} ${isActive ? (isMobile ? 'bg-blue-50 text-blue-600' : 'border-blue-600 text-blue-600') : (isMobile ? 'text-slate-600' : 'border-transparent text-slate-400 hover:text-slate-800')}`}
    >
      {label}
    </NavLink>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f4f7f9] font-sans relative overflow-hidden">
      
      {/* BACKGROUND GLOW ORBS */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* RESPONSIVE NAVBAR */}
      <header className="relative z-20 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2 py-4 md:py-0">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
              <Activity size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase italic md:pr-4 md:border-r border-slate-200">
              R Trades
            </h1>
          </div>

// ... (imports same as before, replace <nav> inside header)
        <nav className="flex space-x-2">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/trades" label="Trades" />
          <NavItem to="/positions" label="Positions" />
          <NavItem to="/summary" label="Matrix" />
          <NavItem to="/settings" label="Settings" />
          <NavItem to="/help" label="Help Guide" /> {/* NAYA TAB */}
        </nav>
// ...
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            <NavItem to="/dashboard" label="Dashboard" />
            <NavItem to="/trades" label="Trades" />
            <NavItem to="/positions" label="Positions" />
            <NavItem to="/summary" label="Matrix" />
            <NavItem to="/settings" label="Settings" />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm">
              Market: <span className="text-blue-600">INDIA</span>
            </div>
            <TradeForm />
            <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
              <LogOut size={18}/>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden p-2 text-slate-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-4 flex flex-col gap-2 z-50 animate-in slide-in-from-top-2">
            <NavItem to="/dashboard" label="Dashboard" isMobile />
            <NavItem to="/trades" label="Trades" isMobile />
            <NavItem to="/positions" label="Positions" isMobile />
            <NavItem to="/summary" label="Matrix" isMobile />
            <NavItem to="/settings" label="Settings" isMobile />
            <div className="border-t border-slate-100 my-2 pt-4 flex items-center justify-between px-2">
              <TradeForm />
              <button onClick={logout} className="text-red-500 font-bold flex items-center gap-2 text-sm bg-red-50 px-4 py-2 rounded-lg">
                <LogOut size={16}/> Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}