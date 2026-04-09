import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateLiveR, processTrade } from '../utils/math';
import EditTradeModal from './EditTradeModal';
import { Edit3, CheckCircle2 } from 'lucide-react';

export default function TradeLogs({ preProcessedData }) {
  const { trades, updateTrade, settings } = useTrades();
  const[editingTrade, setEditingTrade] = useState(null);

  // Use pre-processed data if passed (from Dashboard), else process it here.
  const displayTrades = preProcessedData || trades.map(t => processTrade(t, settings?.rValue)).sort((a, b) => b.dateObj - a.dateObj);

  const handleFinalClose = async (trade) => {
    const exit = prompt(`Enter Exit Price for ${trade.symbol}:`, trade.cmp || trade.entry);
    if (!exit) return;

    const exitPrice = parseFloat(exit);
    const isShort = trade.type === 'SHORT';
    const rewardDist = isShort ? (trade.entry - exitPrice) : (exitPrice - trade.entry);
    const rMultiple = trade.riskDist > 0 ? rewardDist / trade.riskDist : 0;

    let status = 'BE';
    if (rMultiple > 0.1) status = 'Win';
    if (rMultiple < -0.1) status = 'Loss';

    await updateTrade(trade.id, { exitPrice, rMultiple, status, cmp: exitPrice });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left soft-table whitespace-nowrap">
        <thead>
          <tr className="text-[10px] font-bold text-[#a28089] uppercase tracking-widest">
            <th className="p-4">Date</th>
            <th className="p-4">Type</th>
            <th className="p-4">Symbol</th>
            <th className="p-4">Entry</th>
            <th className="p-4">SL / CMP</th>
            <th className="p-4">Status</th>
            <th className="p-4">R-Earned</th>
            <th className="p-4">Net Profit</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5eaf5]">
          {displayTrades.map((t) => {
            const liveR = t.status === 'Open' ? calculateLiveR(t, t.cmp || t.entry) : t.rMultiple;
            const pnl = t.status === 'Open' ? ((t.cmp || t.entry) - t.entry) * t.quantity * (t.type==='SHORT'?-1:1) : t.netPnl;
            
            return (
              <tr key={t.id} className="hover:bg-[#f8f9fc] transition">
                <td className="p-4 text-xs text-[#a28089] font-medium">{t.dateObj.toLocaleDateString('en-GB')}</td>
                <td className="p-4">
                  <span className={`text-[10px] px-2 py-1 rounded font-bold ${t.type === 'SHORT' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>{t.type || 'LONG'}</span>
                </td>
                <td className="p-4 font-bold text-[#8458B3]">{t.symbol}</td>
                <td className="p-4 font-semibold text-[#494D5F]">₹{t.entry}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold ${t.isRiskFree ? 'text-[#a0d2eb]' : 'text-rose-400'}`}>SL: {t.sl}</span>
                    <span className="text-[10px] font-semibold text-[#a28089]">CMP: {t.cmp || t.entry}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    t.status === 'Win' ? 'bg-emerald-100 text-emerald-600' : 
                    t.status === 'Loss' ? 'bg-rose-100 text-rose-600' : 
                    t.status === 'BE' ? 'bg-[#e5eaf5] text-[#8458B3]' : 'bg-orange-100 text-orange-500'
                  }`}>{t.status}</span>
                </td>
                <td className={`p-4 font-bold ${liveR >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {liveR > 0 ? '+' : ''}{liveR.toFixed(2)}R
                </td>
                <td className={`p-4 font-bold ${pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  ₹{Math.floor(pnl).toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    {t.status === 'Open' && (
                      <>
                        <button onClick={() => setEditingTrade(t)} className="p-1.5 hover:bg-[#e5eaf5] text-[#8458B3] rounded transition" title="Edit"><Edit3 size={16}/></button>
                        <button onClick={() => handleFinalClose(t)} className="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded transition" title="Close"><CheckCircle2 size={16}/></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingTrade && <EditTradeModal trade={editingTrade} onClose={() => setEditingTrade(null)} />}
    </div>
  );
}