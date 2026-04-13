import React from 'react';
import { useTrades } from '../context/TradeContext';
import { processTrade } from '../utils/math';

export default function Positions() {
  const { trades, settings } = useTrades();
  const globalR = Number(settings?.rValue) || 1250;

  const processedTrades = trades.map(t => processTrade(t, globalR));
  const openTrades = processedTrades.filter(t => t.status === 'Open');

  const totalExposure = openTrades.reduce((s, t) => s + (t.entry * t.qty), 0);
  const totalOpenRisk = openTrades.reduce((s, t) => s + (t.riskDist * t.qty), 0);
  const totalUnrealized = openTrades.reduce((s, t) => {
    const currentPrice = Number(t.cmp) || t.entry;
    const reward = t.isShort ? (t.entry - currentPrice) : (currentPrice - t.entry);
    return s + (reward * t.qty) - t.fees;
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full max-w-full">
      <h1 className="text-2xl font-bold text-[#8458B3] uppercase tracking-tight break-words">
        Live <span className="text-[#a28089]">Positions</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-full">
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <p className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest break-words">Total Exposure</p>
          <h2 className="text-2xl font-bold text-[#494D5F] mt-1 break-words">₹{(totalExposure||0).toLocaleString()}</h2>
        </div>
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <p className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest break-words">Open Risk</p>
          <h2 className="text-2xl font-bold text-rose-500 mt-1 break-words">
            ₹{(totalOpenRisk||0).toLocaleString()} 
            <span className="text-xs text-[#a28089] break-words"> ({((totalOpenRisk||0)/globalR).toFixed(2)}R)</span>
          </h2>
        </div>
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <p className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest break-words">Unrealized P&L</p>
          <h2 className={`text-2xl font-bold mt-1 break-words ${(totalUnrealized||0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            ₹{Math.floor(totalUnrealized||0).toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="bg-white border border-gray-300 shadow-sm w-full max-w-full">
        <div className="overflow-x-auto w-full max-w-full bg-white">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-50">
              <tr className="divide-x divide-gray-300">
                <th className="px-3 py-2 border border-gray-300 whitespace-nowrap text-center text-xs font-semibold text-[#a28089] uppercase tracking-widest">Type</th>
                <th className="px-3 py-2 border border-gray-300 whitespace-nowrap text-center text-xs font-semibold text-[#a28089] uppercase tracking-widest">Symbol</th>
                <th className="px-3 py-2 border border-gray-300 whitespace-nowrap text-center text-xs font-semibold text-[#a28089] uppercase tracking-widest">Qty</th>
                <th className="px-3 py-2 border border-gray-300 whitespace-nowrap text-center text-xs font-semibold text-[#a28089] uppercase tracking-widest">Avg Entry</th>
                <th className="px-3 py-2 border border-gray-300 whitespace-nowrap text-center text-xs font-semibold text-[#a28089] uppercase tracking-widest">Current SL</th>
                <th className="px-3 py-2 border border-gray-300 whitespace-nowrap text-center text-xs font-semibold text-[#a28089] uppercase tracking-widest">CMP</th>
                <th className="px-3 py-2 border border-gray-300 whitespace-nowrap text-center text-xs font-semibold text-[#a28089] uppercase tracking-widest">Open Risk (R)</th>
                <th className="px-3 py-2 border border-gray-300 whitespace-nowrap text-center text-xs font-semibold text-[#a28089] uppercase tracking-widest">Unrealized P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {openTrades.map(t => {
                const currentPrice = Number(t.cmp) || t.entry;
                const reward = t.isShort ? (t.entry - currentPrice) : (currentPrice - t.entry);
                const unrealized = (reward * t.qty) - t.fees;
                const riskR = t.riskDist > 0 ? ((t.riskDist * t.qty) / globalR) : 0;

                return (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors divide-x divide-gray-300">
                    <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.isShort ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 border border-gray-300 text-center font-bold text-[#8458B3] whitespace-nowrap">{t.symbol}</td>
                    <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap text-[#494D5F]">{t.qty}</td>
                    <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap text-[#494D5F]">₹{t.entry}</td>
                    <td className={`px-3 py-2 border border-gray-300 text-center whitespace-nowrap ${t.isRiskFree ? 'text-[#a0d2eb]' : 'text-rose-400'}`}>₹{t.sl}</td>
                    <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap text-[#494D5F]">₹{currentPrice}</td>
                    <td className="px-3 py-2 border border-gray-300 text-center text-rose-500 whitespace-nowrap">{riskR.toFixed(2)}R</td>
                    <td className={`px-3 py-2 border border-gray-300 text-center font-bold whitespace-nowrap ${unrealized >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
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