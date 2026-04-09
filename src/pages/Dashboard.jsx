import React from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateMetrics } from '../utils/math';
import Trades from './Trades';

export default function Dashboard() {
  const { trades, settings } = useTrades();
  // Using the new unified single source of truth
  const m = calculateMetrics(trades, settings?.rValue || 1250);

  const MetricCard = ({ title, value, sub, color="text-[#8458B3]", bg="bg-white" }) => (
    <div className={`${bg} border border-[#d0bdf4] p-6 rounded-2xl shadow-sm`}>
      <p className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest mb-1">{title}</p>
      <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
      <p className="text-[10px] font-medium text-[#a28089] mt-2">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-[#494D5F]">TRADING <span className="text-[#8458B3]">TERMINAL</span></h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Win Rate" value={`${(m.winRate * 100).toFixed(1)}%`} sub="System Accuracy" color="text-[#a0d2eb]" />
        <MetricCard title="Expectancy" value={`${m.expectancy.toFixed(2)}R`} sub="Avg Edge Per Trade" />
        <MetricCard title="Intensity" value={`₹${Math.floor(m.intensity).toLocaleString()}`} sub="Cumulative Power" color="text-[#494D5F]" />
        <MetricCard title="Net P&L (Post Fees)" value={`₹${Math.floor(m.totalNetPnl).toLocaleString()}`} sub="Realized Profit" color="text-emerald-500" />
      </div>

      <div className="bg-[#ffffff] border border-[#d0bdf4] p-5 rounded-2xl text-center shadow-sm">
        <p className="text-xs font-semibold text-[#a28089] uppercase tracking-widest">Total Open Risk (TOR)</p>
        <h2 className={`text-3xl font-bold mt-1 ${m.tor > 3 ? 'text-rose-500' : 'text-[#8458B3]'}`}>{m.tor.toFixed(2)}R</h2>
      </div>

      {/* Sending processed trades to the Trades component to ensure UI sync */}
      <div>
         <Trades isDashboard={true} preProcessedData={m.processedTrades} />
      </div>
    </div>
  );
}