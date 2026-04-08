import React from 'react';
import { useTrades } from '../context/TradeContext';
import { calculatePositionsMetrics, calculateLiveR } from '../utils/math';

export default function Positions() {
  const { trades, settings } = useTrades();
  const openTrades = trades.filter(t => t.status === 'Open');
  const pm = calculatePositionsMetrics(trades);
  const globalR = settings?.rValue || 1250;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black text-[#8458B3] uppercase italic">Live <span className="text-[#a0d2eb]">Positions</span></h1>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest">Total Exposure</p>
          <h2 className="text-2xl font-black text-[#333] mt-2">₹{pm.totalExposure.toLocaleString()}</h2>
        </div>
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest">Open Risk</p>
          <h2 className="text-2xl font-black text-rose-600 mt-2">₹{pm.totalOpenRisk.toLocaleString()} <span className="text-sm text-[#a28089]">({(pm.totalOpenRisk/globalR).toFixed(2)}R)</span></h2>
        </div>
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-black text-[#8458B3] uppercase tracking-widest">Unrealized P&L</p>
          <h2 className={`text-2xl font-black mt-2 ${pm.totalUnrealized >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ₹{Math.floor(pm.totalUnrealized).toLocaleString()}
          </h2>
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
                <th className="p-4">Avg Entry</th>
                <th className="p-4">Current SL</th>
                <th className="p-4">CMP</th>
                <th className="p-4">Open Risk (R)</th>
                <th className="p-4">Unrealized</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-[#333]">
              {openTrades.map(t => {
                const liveR = calculateLiveR(t, t.cmp || t.entry);
                const unrealized = ( (t.cmp || t.entry) - t.entry ) * t.quantity;
                const riskR = (Math.abs(t.entry - t.sl) * t.quantity) / globalR;

                return (
                  <tr key={t.id} className="hover:bg-[#f8fafc] transition-colors border-b border-[#e5eaf5]">
                    <td className="p-4 font-black text-[#8458B3]">{t.symbol}</td>
                    <td className="p-4">{t.quantity}</td>
                    <td className="p-4">₹{t.entry}</td>
                    <td className={`p-4 ${t.isRiskFree ? 'text-emerald-600' : 'text-rose-600'}`}>₹{t.sl}</td>
                    <td className="p-4 text-[#a28089]">₹{t.cmp || t.entry}</td>
                    <td className="p-4 text-rose-600">{riskR.toFixed(2)}R</td>
                    <td className={`p-4 font-black ${unrealized >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ₹{Math.floor(unrealized).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {openTrades.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-[#a28089] italic font-medium">No active positions to monitor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}