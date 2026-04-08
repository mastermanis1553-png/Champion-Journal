import React from 'react';
import { useTrades } from '../context/TradeContext';
import { calculatePositionsMetrics, calculateLiveR } from '../utils/math';

export default function Positions() {
  const { trades, settings } = useTrades();
  const openTrades = trades.filter(t => t.status === 'Open');
  const pm = calculatePositionsMetrics(trades);
  const globalR = settings?.rValue || 1250;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-slate-100 uppercase italic">Live <span className="text-blue-500">Positions</span></h1>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Exposure</p>
          <h2 className="text-2xl font-black text-slate-100 mt-1">₹{pm.totalExposure.toLocaleString()}</h2>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Open Risk</p>
          <h2 className="text-2xl font-black text-rose-400 mt-1">₹{pm.totalOpenRisk.toLocaleString()} <span className="text-xs text-slate-500">({(pm.totalOpenRisk/globalR).toFixed(2)}R)</span></h2>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unrealized P&L</p>
          <h2 className={`text-2xl font-black mt-1 ${pm.totalUnrealized >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ₹{Math.floor(pm.totalUnrealized).toLocaleString()}
          </h2>
        </div>
      </div>

      {/* POSITIONS TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-center whitespace-nowrap pro-table">
            <thead>
              <tr className="bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-700">
                <th className="p-4">Symbol</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Avg Entry</th>
                <th className="p-4">Current SL</th>
                <th className="p-4">CMP</th>
                <th className="p-4">Open Risk (R)</th>
                <th className="p-4">Unrealized</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-300">
              {openTrades.map(t => {
                const liveR = calculateLiveR(t, t.cmp || t.entry);
                const unrealized = ( (t.cmp || t.entry) - t.entry ) * t.quantity;
                const riskR = (Math.abs(t.entry - t.sl) * t.quantity) / globalR;

                return (
                  <tr key={t.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-black text-blue-400">{t.symbol}</td>
                    <td className="p-4">{t.quantity}</td>
                    <td className="p-4">₹{t.entry}</td>
                    <td className={`p-4 ${t.isRiskFree ? 'text-emerald-400' : 'text-rose-400'}`}>₹{t.sl}</td>
                    <td className="p-4 text-slate-400">₹{t.cmp || t.entry}</td>
                    <td className="p-4 text-rose-400">{riskR.toFixed(2)}R</td>
                    <td className={`p-4 font-black ${unrealized >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ₹{Math.floor(unrealized).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {openTrades.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-slate-500 italic">No active positions to monitor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}