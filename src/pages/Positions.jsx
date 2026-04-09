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
      <h1 className="text-2xl font-bold text-[#8458B3] uppercase tracking-tight">Live <span className="text-[#a28089]">Positions</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <p className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest">Total Exposure</p>
          <h2 className="text-2xl font-bold text-[#494D5F] mt-1">₹{pm.totalExposure.toLocaleString()}</h2>
        </div>
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <p className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest">Open Risk</p>
          <h2 className="text-2xl font-bold text-rose-500 mt-1">₹{pm.totalOpenRisk.toLocaleString()} <span className="text-xs text-[#a28089]">({(pm.totalOpenRisk/globalR).toFixed(2)}R)</span></h2>
        </div>
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <p className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest">Unrealized P&L</p>
          <h2 className={`text-2xl font-bold mt-1 ${pm.totalUnrealized >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            ₹{Math.floor(pm.totalUnrealized).toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="bg-white border border-[#d0bdf4] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-center whitespace-nowrap soft-table">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-[#a28089]">
                <th className="p-4">Type</th>
                <th className="p-4">Symbol</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Avg Entry</th>
                <th className="p-4">Current SL</th>
                <th className="p-4">CMP</th>
                <th className="p-4">Open Risk (R)</th>
                <th className="p-4">Unrealized</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {openTrades.map(t => {
                const liveR = calculateLiveR(t, t.cmp || t.entry);
                const isShort = t.type === 'SHORT';
                const unrealized = isShort ? (t.entry - (t.cmp || t.entry)) * t.quantity : ((t.cmp || t.entry) - t.entry) * t.quantity;
                const riskR = (Math.abs(t.entry - t.sl) * t.quantity) / globalR;

                return (
                  <tr key={t.id} className="hover:bg-[#f8f9fc] transition-colors">
                    <td className="p-4"><span className={`text-[10px] px-2 py-1 rounded ${isShort ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>{t.type || 'LONG'}</span></td>
                    <td className="p-4 font-bold text-[#8458B3]">{t.symbol}</td>
                    <td className="p-4">{t.quantity}</td>
                    <td className="p-4">₹{t.entry}</td>
                    <td className={`p-4 ${t.isRiskFree ? 'text-[#a0d2eb]' : 'text-rose-400'}`}>₹{t.sl}</td>
                    <td className="p-4 text-[#494D5F]">₹{t.cmp || t.entry}</td>
                    <td className="p-4 text-rose-500">{riskR.toFixed(2)}R</td>
                    <td className={`p-4 font-bold ${unrealized >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      ₹{Math.floor(unrealized).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}