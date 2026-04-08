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
    const headers =["Date,Symbol,Entry,SL,Target,Qty,Status,R-Earned,Net Profit\n"];
    const rows = trades.map(t => {
      const entryDate = t.date?.seconds ? new Date(t.date.seconds * 1000).toLocaleDateString('en-GB') : '';
      const exitDate = t.exitDate ? new Date(t.exitDate).toLocaleDateString('en-GB') : '-';
      const liveR = t.rMultiple || 0;
      const netPnl = liveR * (t.riskAmount || 1250);
      return `${entryDate},${t.symbol},${t.entry},${t.sl},${t.target || ''},${t.quantity},${t.status},${liveR.toFixed(2)},${Math.floor(netPnl)}`;
    });
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
      className={({ isActive }) => `px-5 py-5 text-sm font-bold border-b-2 transition-all duration-300 ${isActive ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
    >
      {label}
    </NavLink>
  );

  return (
    // DEEP DARK GRADIENT BACKGROUND
    <div className="flex flex-col h-screen bg-[#050B14] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050B14] to-[#02040A] font-sans relative overflow-hidden text-slate-200">
      
      {/* PREMIUM GLOW ORBS */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* DARK GLASSMORPHISM NAVBAR */}
      <header className="relative z-20 bg-[#050B14]/70 backdrop-blur-xl border-b border-slate-800 shadow-sm flex items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-900/30">
              <Activity size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-black text-white tracking-tighter uppercase italic pr-4 border-r border-slate-800">
              R Trades
            </h1>
          </div>
          
          <nav className="flex space-x-2">
            <NavItem to="/dashboard" label="Dashboard" />
            <NavItem to="/trades" label="Trades" />
            <NavItem to="/positions" label="Positions" />
            <NavItem to="/summary" label="Matrix" />
            <NavItem to="/settings" label="Settings" />
            <NavItem to="/help" label="Help Guide" />
          </nav>
        </div>
        
        <div className="flex items-center space-x-5">
          <div className="bg-[#0B1320] border border-slate-800 rounded-lg px-4 py-2 text-xs font-bold text-slate-400 shadow-sm">
            Market: <span className="text-blue-500">INDIA (NSE)</span>
          </div>
          
          {/* EXPORT BUTTON */}
          <button onClick={exportToCSV} className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-900/50 transition-colors">
            <Download size={14} /> EXPORT
          </button>

          <TradeForm />
          
          <button onClick={logout} className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-900/20">
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