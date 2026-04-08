import React from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateMetrics } from '../utils/math';
import Trades from './Trades';

export default function Dashboard() {
  const { trades, settings } = useTrades();
  const m = calculateMetrics(trades, settings?.rValue || 1250);

  const MetricCard = ({ title, value, sub, color="text-slate-100" }) => (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <h2 className={`text-3xl font-black ${color}`}>{value}</h2>
      <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight uppercase">Trading <span className="text-blue-500">Terminal</span></h1>
        <p className="text-slate-400 text-sm">Institutional performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Win Rate" value={`${(m.winRate * 100).toFixed(1)}%`} sub="System Accuracy" />
        <MetricCard title="Expectancy" value={`${m.expectancy.toFixed(2)}R`} sub="Avg Edge Per Trade" color="text-blue-400" />
        
        {/* FIX: Intensity in ₹ */}
        <MetricCard title="Intensity" value={`₹${Math.floor(m.intensity || 0).toLocaleString()}`} sub="Cumulative Power" color="text-emerald-400" />
        
        {/* FIX: Net P&L in ₹ */}
        <MetricCard title="Net P&L" value={`₹${Math.floor(m.netPnl || 0).toLocaleString()}`} sub="Total Monetary Gain" color="text-emerald-400" />
      </div>

      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl text-center shadow-sm">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Open Risk (TOR) Exposure</p>
        <h2 className={`text-4xl font-black ${m.tor > 3 ? 'text-rose-500' : 'text-slate-100'}`}>{m.tor.toFixed(2)}R</h2>
      </div>

      <div>
         <Trades isDashboard={true} />
      </div>
    </div>
  );
}