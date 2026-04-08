import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import TradeForm from './TradeForm';
import { LogOut, Activity, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrades } from '../context/TradeContext';

export default function Layout() {
  const { logout } = useAuth();
  const { trades } = useTrades();

  // EXPORT TO EXCEL LOGIC
  const exportToCSV = () => {
    const headers =["Date,Symbol,Entry,SL,Target,Qty,Status,R-Earned\n"];
    const rows = trades.map(t => `${t.date?.seconds ? new Date(t.date.seconds * 1000).toLocaleDateString('en-GB') : ''},${t.symbol},${t.entry},${t.sl},${t.target || ''},${t.quantity},${t.status},${t.rMultiple || 0}`);
    const csv = headers + rows.join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'R_Trades_Export.csv';
    a.click();
  };

  const NavItem = ({ to, label }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => `px-4 py-5 text-sm font-bold border-b-2 transition-all duration-300 ${isActive ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
    >
      {label}
    </NavLink>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans relative overflow-hidden text-slate-200">
      
      {/* HEADER NAVBAR */}
      <header className="relative z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-blue-500" />
            <h1 className="text-xl font-black text-slate-100 tracking-tighter uppercase italic pr-4 border-r border-slate-700">
              R Trades
            </h1>
          </div>
          
          {/* 🔴 YAHAN FIX KIYA HAI - SAARE LINKS WAPAS AA GAYE */}
          <nav className="flex space-x-1">
            <NavItem to="/dashboard" label="Dashboard" />
            <NavItem to="/trades" label="Trades" />
            <NavItem to="/positions" label="Positions" />
            <NavItem to="/summary" label="Matrix" />
            <NavItem to="/settings" label="Settings" />
            <NavItem to="/help" label="Help Guide" />
          </nav>
        </div>
        
        {/* RIGHT CONTROLS */}
        <div className="flex items-center space-x-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-xs font-bold text-slate-400 shadow-sm hidden md:block">
            Market: <span className="text-blue-500">INDIA (NSE)</span>
          </div>

          <button onClick={exportToCSV} className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors">
            <Download size={14} /> EXPORT
          </button>
          
          <TradeForm />
          
          <button onClick={logout} className="text-slate-400 hover:text-rose-500 p-2 transition-colors">
            <LogOut size={18}/>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT OUTLET */}
      <main className="relative z-10 flex-1 overflow-auto p-8">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}