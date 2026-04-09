import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import TradeForm from './TradeForm';
import { LogOut, Activity } from 'lucide-react';

export default function Layout() {
  const NavItem = ({ to, label }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => `px-4 py-5 text-sm font-semibold border-b-2 transition-all duration-300 ${isActive ? 'border-[#8458B3] text-[#8458B3]' : 'border-transparent text-[#a28089] hover:text-[#494D5F]'}`}
    >
      {label}
    </NavLink>
  );

  return (
    <div className="flex flex-col h-screen bg-[#e5eaf5] font-sans relative overflow-hidden text-[#494D5F]">
      
      <header className="relative z-20 bg-white border-b border-[#d0bdf4] shadow-sm flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 pr-4 border-r border-[#e5eaf5]">
            <Activity size={22} className="text-[#a0d2eb]" />
            <h1 className="text-xl font-bold text-[#8458B3] tracking-tight">R Trades</h1>
          </div>
          
          <nav className="flex space-x-1">
            <NavItem to="/dashboard" label="Dashboard" />
            <NavItem to="/trades" label="Trades" />
            <NavItem to="/positions" label="Positions" />
            <NavItem to="/summary" label="Matrix" />
            <NavItem to="/diary" label="Diary" /> {/* NEW PAGE LINK */}
            <NavItem to="/settings" label="Settings" />
            <NavItem to="/help" label="Help" />
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <TradeForm />
          <button className="text-[#a28089] hover:text-rose-500 p-2 transition">
            <LogOut size={18}/>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-auto p-8">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}