import React from 'react';
import { useTrades } from '../context/TradeContext';
import { calculatePositionsMetrics, getTradeMetrics, convertTorToR } from '../utils/math';

export default function Positions() {
  const { trades, settings } = useTrades();
  const metrics = calculatePositionsMetrics(trades);
  const baseRisk = parseFloat(settings?.rValue) || 1000;

  // Convert TOR to R
  const torInR = convertTorToR(metrics.totalOpenRiskRupees, baseRisk);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#8458B3] uppercase tracking-tight" style={{ fontStyle: 'normal' }}>
          Live <span className="text-[#a0d2eb]">Positions</span>
        </h1>
        <p className="text-[#a28089] text-sm mt-3 font-medium">All open positions with real-time P&L (updates when CMP changes)</p>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest mb-2">Total Exposure</p>
          <h2 className="text-2xl font-black text-[#1a1a2e]" style={{ fontStyle: 'normal' }}>₹{metrics.totalExposure.toLocaleString()}</h2>
          <p className="text-xs text-[#a28089] mt-2">Capital deployed</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest mb-2">Total Open Risk</p>
          <h2 className="text-2xl font-black text-rose-600" style={{ fontStyle: 'normal' }}>{torInR.toFixed(2)}R</h2>
          <p className="text-xs text-[#a28089] mt-2">₹{Math.floor(metrics.totalOpenRiskRupees).toLocaleString()} at risk</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest mb-2">Unrealized P&L</p>
          <h2 className={`text-2xl font-black ${metrics.totalUnrealizedPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} style={{ fontStyle: 'normal' }}>
            ₹{Math.floor(metrics.totalUnrealizedPnl).toLocaleString()}
          </h2>
          <p className="text-xs text-[#a28089] mt-2">{metrics.totalUnrealizedR.toFixed(2)}R earned</p>
        </div>
      </div>

      {/* POSITIONS TABLE */}
      <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-center whitespace-nowrap">
            <thead>
              <tr className="bg-[#f8fafc] text-xs font-black uppercase tracking-widest text-[#8458B3] border-b-2 border-[#d0bdf4]">
                <th className="p-4">Symbol</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Entry</th>
                <th className="p-4">SL / Risk per unit</th>
                <th className="p-4">CMP</th>
                <th className="p-4">Total Risk (₹)</th>
                <th className="p-4">Unrealized R</th>
                <th className="p-4">Unrealized P&L</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-[#1a1a2e]">
              {trades.filter(t => t.status === 'Open').map(t => {
                const metrics = getTradeMetrics(t);
                if (!metrics) return null;

                return (
                  <tr key={t.id} className="hover:bg-[#f8fafc] transition-colors border-b border-[#e5eaf5]">
                    <td className="p-4 font-black text-[#8458B3]">{t.symbol}</td>
                    <td className="p-4">{t.quantity}</td>
                    <td className="p-4">₹{t.entry}</td>
                    <td className="p-4">
                      <div className="flex flex-col items-center">
                        <span className={t.isRiskFree ? 'text-emerald-600 font-black' : 'text-rose-600 font-black'}>₹{t.sl}</span>
                        <span className="text-xs text-[#a28089] mt-1">₹{Math.abs(t.entry - t.sl).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#a28089]">₹{t.cmp || t.entry}</td>
                    <td className="p-4 text-rose-600 font-black">₹{Math.floor(metrics.risk).toLocaleString()}</td>
                    <td className={`p-4 font-black ${metrics.r >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {metrics.r > 0 ? '+' : ''}{metrics.r.toFixed(2)}R
                    </td>
                    <td className={`p-4 font-black ${metrics.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ₹{Math.floor(metrics.pnl).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {trades.filter(t => t.status === 'Open').length === 0 && (
                <tr>
                  <td colSpan="8" className="p-10 text-[#a28089] font-medium">No active positions to monitor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}