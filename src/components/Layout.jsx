// Layout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import TradeForm from './TradeForm';
import { LogOut, Activity } from 'lucide-react';

export default function Layout() {
  const NavItem = ({ to, label }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        px-2 sm:px-3 md:px-4 
        py-3 md:py-5 
        text-xs sm:text-sm font-semibold 
        border-b-2 transition-all duration-300
        ${isActive 
          ? 'border-[#8458B3] text-[#8458B3]' 
          : 'border-transparent text-[#a28089] hover:text-[#494D5F]'
        }
      `}
    >
      <span className="break-words">{label}</span>
    </NavLink>
  );

  return (
    <div className="flex flex-col h-screen bg-[#e5eaf5] font-sans relative overflow-hidden text-[#494D5F] w-full max-w-full">
      
      <header className="relative z-20 bg-white border-b border-[#d0bdf4] shadow-sm flex flex-wrap items-center justify-between px-4 sm:px-6 md:px-8 py-2 w-full max-w-full">
        
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full md:w-auto flex-wrap md:flex-nowrap max-w-full">
          
          <div className="flex items-center gap-2 pr-2 sm:pr-4 border-r border-[#e5eaf5] max-w-full">
            <Activity size={20} className="text-[#a0d2eb]" />
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#8458B3] tracking-tight break-words">
              R Trades
            </h1>
          </div>
          
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 md:mt-0 w-full max-w-full">
            <NavItem to="/dashboard" label="Dashboard" />
            <NavItem to="/trades" label="Trades" />
            <NavItem to="/positions" label="Positions" />
            <NavItem to="/summary" label="Matrix" />
            <NavItem to="/diary" label="Diary" />
            <NavItem to="/settings" label="Settings" />
            <NavItem to="/help" label="Help" />
          </nav>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full md:w-auto justify-end mt-2 md:mt-0 max-w-full">
          <div className="scale-90 sm:scale-95 md:scale-100 max-w-full">
            <TradeForm />
          </div>
          <button className="text-[#a28089] hover:text-rose-500 p-2 transition">
            <LogOut size={18}/>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-auto p-4 sm:p-6 md:p-8 w-full max-w-full">
        <div className="w-full max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}