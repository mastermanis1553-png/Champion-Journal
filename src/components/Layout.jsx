import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import TradeForm from './TradeForm';
import { LogOut, Activity, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrades } from '../context/TradeContext';

export default function Layout() {
  const { logout } = useAuth();
  const { trades } = useTrades();

  const exportToCSV = () => {
    const headers = ["Date,Symbol,Entry,SL,Target,Qty,Status,R-Earned\n"];
    const rows = trades.map(t => `${t.date?.seconds ? new Date(t.date.seconds * 1000).toLocaleDateString('en-GB') : ''},${t.symbol},${t.entry},${t.sl},${t.target || ''},${t.quantity},${t.status},${t.rMultiple || 0}\n`);
    const csv = headers + rows.join("");
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
      className={({ isActive }) => `px-4 py-3 text-sm font-semibold border-b-4 transition-all duration-200 ${isActive ? 'border-[#8458B3] text-[#8458B3]' : 'border-transparent text-[#a28089] hover:text-[#8458B3]'}`}
    >
      {label}
    </NavLink>
  );

  return (
    <div className="flex flex-col h-screen bg-[#e5eaf5] font-sans relative overflow-hidden">
      
      {/* HEADER NAVBAR */}
      <header className="relative z-20 bg-white/70 backdrop-blur-xl border-b-2 border-[#d0bdf4] shadow-lg flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#8458B3] to-[#a0d2eb] p-2.5 rounded-xl shadow-lg">
              <Activity size={26} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-[#8458B3] tracking-tight" style={{ fontStyle: 'normal' }}>
                R Trades
              </h1>
              <p className="text-xs font-semibold text-[#a28089] tracking-wide">Trading Terminal</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-1 ml-8">
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
          <div className="bg-[#d0bdf4]/40 border border-[#d0bdf4] rounded-lg px-4 py-2.5 text-xs font-bold tracking-wider text-[#8458B3] shadow-sm hidden md:block">
            Market: <span className="text-[#8458B3] font-black ml-2">INDIA (NSE)</span>
          </div>

          <button onClick={exportToCSV} className="flex items-center gap-2 bg-gradient-to-r from-[#a0d2eb]/50 to-[#d0bdf4]/50 hover:from-[#a0d2eb] hover:to-[#d0bdf4] text-[#8458B3] px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 shadow-md hover:shadow-lg uppercase">
            <Download size={14} /> EXPORT
          </button>
          
          <TradeForm />
          
          <button onClick={logout} className="text-[#a28089] hover:text-[#8458B3] p-2.5 transition-colors duration-200 hover:bg-white/30 rounded-lg">
            <LogOut size={20}/>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 overflow-auto p-8">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}