import React from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateMetrics } from '../utils/math';
import Trades from './Trades';

export default function Dashboard() {
  const { trades, settings } = useTrades();
  const m = calculateMetrics(trades, settings?.rValue || 1250);

  const MetricCard = ({ title, value, sub, color="text-[#1a1a2e]" }) => (
    <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:border-[#8458B3]">
      <p className="text-xs font-black text-[#8458B3] uppercase tracking-wider mb-3">{title}</p>
      <h2 className={`text-3xl font-black ${color}`} style={{ fontStyle: 'normal' }}>{value}</h2>
      <p className="text-xs font-semibold text-[#a28089] mt-2 uppercase tracking-wider">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#8458B3] tracking-tight uppercase" style={{ fontStyle: 'normal' }}>
          Trading <span className="text-[#a0d2eb]">Terminal</span>
        </h1>
        <p className="text-[#a28089] text-sm mt-3 font-medium">Institutional-grade performance overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MetricCard title="Win Rate" value={`${(m.winRate * 100).toFixed(1)}%`} sub="System Accuracy" color="text-[#1a1a2e]" />
        <MetricCard title="Expectancy" value={`${m.expectancy.toFixed(2)}R`} sub="Avg Edge Per Trade" color="text-[#8458B3]" />
        <MetricCard title="Intensity" value={`₹${Math.floor(m.intensity || 0).toLocaleString()}`} sub="Cumulative Power" color="text-emerald-600" />
        <MetricCard title="Net P&L" value={`₹${Math.floor(m.netPnl || 0).toLocaleString()}`} sub="Total Monetary Gain" color="text-emerald-600" />
      </div>

      <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-8 rounded-2xl text-center shadow-lg">
        <p className="text-xs font-black text-[#8458B3] uppercase tracking-wider mb-3">Total Open Risk (TOR) Exposure</p>
        <h2 className={`text-4xl font-black ${m.tor > 3 ? 'text-rose-600' : 'text-[#1a1a2e]'}`} style={{ fontStyle: 'normal' }}>{m.tor.toFixed(2)}R</h2>
      </div>

      <div>
        <Trades isDashboard={true} />
      </div>
    </div>
  );
}