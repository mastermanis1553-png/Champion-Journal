import React from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateMetrics, convertTorToR } from '../utils/math';
import Trades from './Trades';

export default function Dashboard() {
  const { trades, settings } = useTrades();
  const metrics = calculateMetrics(trades);
  const baseRisk = parseFloat(settings?.rValue) || 1000;

  // Convert TOR to R
  const torInR = convertTorToR(metrics.torInRupees, baseRisk);

  const MetricCard = ({ title, value, sub, color = "text-[#1a1a2e]" }) => (
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
        <p className="text-[#a28089] text-sm mt-3 font-medium">Real-time performance analytics with live calculations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MetricCard 
          title="Win Rate" 
          value={`${(metrics.winRate * 100).toFixed(1)}%`} 
          sub="System Accuracy" 
          color="text-[#1a1a2e]" 
        />
        <MetricCard 
          title="Expectancy" 
          value={`${metrics.expectancy.toFixed(2)}R`} 
          sub="Avg Edge Per Trade" 
          color="text-[#8458B3]" 
        />
        <MetricCard 
          title="Intensity" 
          value={`${metrics.intensity.toFixed(2)}R`}
          sub="Cumulative Power (R-Based)" 
          color="text-emerald-600" 
        />
        <MetricCard 
          title="Net P&L" 
          value={`₹${Math.floor(metrics.netPnl).toLocaleString()}`} 
          sub="Closed + Unrealized (₹)" 
          color="text-emerald-600" 
        />
      </div>

      <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-8 rounded-2xl text-center shadow-lg">
        <p className="text-xs font-black text-[#8458B3] uppercase tracking-wider mb-3">Total Open Risk (TOR)</p>
        <h2 className={`text-4xl font-black ${torInR > 3 ? 'text-rose-600' : 'text-[#1a1a2e]'}`} style={{ fontStyle: 'normal' }}>
          {torInR.toFixed(2)}R
        </h2>
        <p className="text-xs text-[#a28089] mt-3 font-semibold">₹{Math.floor(metrics.torInRupees).toLocaleString()} at risk</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest mb-2">Closed Trades</p>
          <h3 className="text-2xl font-black text-[#1a1a2e]">{metrics.total}</h3>
          <p className="text-xs text-[#a28089] mt-2">Winners: {metrics.winners} | Losers: {metrics.losers}</p>
        </div>

        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest mb-2">Total R Earned</p>
          <h3 className={`text-2xl font-black ${metrics.totalR >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {metrics.totalR.toFixed(2)}R
          </h3>
          <p className="text-xs text-[#a28089] mt-2">From Closed Trades</p>
        </div>

        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest mb-2">Unrealized (Open)</p>
          <h3 className={`text-2xl font-black ${metrics.totalRFromOpen >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {metrics.totalRFromOpen.toFixed(2)}R
          </h3>
          <p className="text-xs text-[#a28089] mt-2">₹{Math.floor(metrics.unrealizedPnl).toLocaleString()}</p>
        </div>
      </div>

      <div>
        <Trades isDashboard={true} />
      </div>
    </div>
  );
}