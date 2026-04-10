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

      <div className="bg-white border border-[#d0bdf4] rounded-2xl overflow-hidden shadow-sm w-full max-w-full">
        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full text-center soft-table">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-[#a28089]">
                <th className="p-4 break-words">Type</th>
                <th className="p-4 break-words">Symbol</th>
                <th className="p-4 break-words">Qty</th>
                <th className="p-4 break-words">Avg Entry</th>
                <th className="p-4 break-words">Current SL</th>
                <th className="p-4 break-words">CMP</th>
                <th className="p-4 break-words">Open Risk (R)</th>
                <th className="p-4 break-words">Unrealized P&L</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {openTrades.map(t => {
                const currentPrice = Number(t.cmp) || t.entry;
                const reward = t.isShort ? (t.entry - currentPrice) : (currentPrice - t.entry);
                const unrealized = (reward * t.qty) - t.fees;
                const riskR = t.riskDist > 0 ? ((t.riskDist * t.qty) / globalR) : 0;

                return (
                  <tr key={t.id} className="hover:bg-[#f8f9fc] transition-colors">
                    <td className="p-4 break-words">
                      <span className={`text-[10px] px-2 py-1 rounded font-bold break-words ${t.isShort ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#8458B3] break-words">{t.symbol}</td>
                    <td className="p-4 break-words">{t.qty}</td>
                    <td className="p-4 break-words">₹{t.entry}</td>
                    <td className={`p-4 break-words ${t.isRiskFree ? 'text-[#a0d2eb]' : 'text-rose-400'}`}>₹{t.sl}</td>
                    <td className="p-4 text-[#494D5F] break-words">₹{currentPrice}</td>
                    <td className="p-4 text-rose-500 break-words">{riskR.toFixed(2)}R</td>
                    <td className={`p-4 font-bold break-words ${unrealized >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
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