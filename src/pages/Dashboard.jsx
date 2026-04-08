import React from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateMetrics } from '../utils/math';
import { Target, TrendingUp, Zap, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { trades, settings } = useTrades();
  const m = calculateMetrics(trades, settings?.rValue || 1250);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Terminal</span></h1>
        <p className="text-slate-500 text-sm font-semibold mt-1">Institutional performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard icon={Target} label="Win Rate" value={`${((m.winRate || 0) * 100).toFixed(1)}%`} sub="System Accuracy" color="text-blue-600" />
        <MetricCard icon={TrendingUp} label="Expectancy" value={(m.expectancy || 0).toFixed(2)} sub="Average edge per trade" color="text-indigo-600" />
        <MetricCard icon={Zap} label="Intensity" value={Math.floor(m.intensity || 0).toLocaleString()} sub="Cumulative Power" color="text-amber-500" />
        <MetricCard icon={DollarSign} label="Net P&L" value={`₹${Math.floor(m.totalProfit || 0).toLocaleString()}`} sub="Total Monetary Gain" color="text-emerald-500" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
         <h3 className="font-black text-slate-400 uppercase tracking-widest mb-3 text-xs">Total Open Risk (TOR) Exposure</h3>
         <p className={`text-6xl font-black tracking-tighter ${(m.tor || 0) > 4 ? 'text-red-500' : 'text-slate-800'}`}>{(m.tor || 0).toFixed(2)}R</p>
         <p className="text-sm text-slate-500 mt-4 font-semibold">Monitor your live capital exposure. Adjust based on market regime.</p>
      </div>
    </div>
  );
}

const MetricCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={100} className={color} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className={color} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h2>
      <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase">{sub}</p>
    </div>
  </div>
);