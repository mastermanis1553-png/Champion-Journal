import React from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateMetrics } from '../utils/math';
import Trades from './Trades';

export default function Dashboard() {
  const { trades, settings } = useTrades();
  const m = calculateMetrics(trades, settings?.rValue || 1250);

  const MetricCard = ({ title, value, sub, color="text-[#333]" }) => (
    <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest mb-2">{title}</p>
      <h2 className={`text-3xl font-black ${color}`}>{value}</h2>
      <p className="text-xs font-bold text-[#a28089] mt-2 uppercase">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[#8458B3] tracking-tight uppercase">Trading <span className="text-[#a0d2eb]">Terminal</span></h1>
        <p className="text-[#a28089] text-sm mt-2 font-medium">Institutional performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Win Rate" value={`${(m.winRate * 100).toFixed(1)}%`} sub="System Accuracy" color="text-[#333]" />
        <MetricCard title="Expectancy" value={`${m.expectancy.toFixed(2)}R`} sub="Avg Edge Per Trade" color="text-[#8458B3]" />
        <MetricCard title="Intensity" value={`₹${Math.floor(m.intensity || 0).toLocaleString()}`} sub="Cumulative Power" color="text-emerald-600" />
        <MetricCard title="Net P&L" value={`₹${Math.floor(m.netPnl || 0).toLocaleString()}`} sub="Total Monetary Gain" color="text-emerald-600" />
      </div>

      <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-8 rounded-2xl text-center shadow-lg">
        <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest mb-3">Total Open Risk (TOR) Exposure</p>
        <h2 className={`text-4xl font-black ${m.tor > 3 ? 'text-rose-600' : 'text-[#333]'}`}>{m.tor.toFixed(2)}R</h2>
      </div>

      <div>
        <Trades isDashboard={true} />
      </div>
    </div>
  );
}