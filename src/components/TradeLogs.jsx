import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateLiveR, processTrade, calculateDays } from '../utils/math';
import EditTradeModal from './EditTradeModal';
import { Edit3, CheckCircle2 } from 'lucide-react';

export default function TradeLogs({ preProcessedData, searchTerm = '', filterStatus = 'All Trades', showExitDate, showPositionSize }) {
  const { trades, updateTrade, settings } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);

  const safeSearchTerm = (searchTerm || '').toLowerCase();
  const displayTrades = (preProcessedData || trades.map(t => processTrade(t, settings?.rValue)).sort((a, b) => b.dateObj - a.dateObj))
    .filter(t => (t.symbol || '').toLowerCase().includes(safeSearchTerm))
    .filter(t => filterStatus === 'All Trades' ? true : t.status === filterStatus);

  const handleFinalClose = async (trade) => {
    const exit = prompt(`Enter Exit Price for ${trade.symbol}:`, trade.cmp || trade.entry);
    if (!exit) return;
    
    const exitPrice = Number(exit);
    const isShort = trade.type === 'SHORT';
    const rewardDist = isShort ? (trade.entry - exitPrice) : (exitPrice - trade.entry);
    const rMultiple = trade.riskDist > 0 ? rewardDist / trade.riskDist : 0;
    
    let status = 'BE';
    if (rMultiple > 0.1) status = 'Win';
    if (rMultiple < -0.1) status = 'Loss';
    
    await updateTrade(trade.id, { exitPrice, rMultiple, status, cmp: exitPrice, exitDate: new Date().toISOString() });
  };

  return (
    <div className="w-full max-w-full overflow-x-auto">
      <table className="w-full text-left soft-table whitespace-nowrap min-w-[900px] md:min-w-full">
        
        <thead>
          <tr className="text-[9px] sm:text-[10px] font-bold text-[#a28089] uppercase tracking-widest bg-white">
            <th className="p-2 sm:p-3 md:p-4">Date</th>
            {showExitDate && <th className="p-2 sm:p-3 md:p-4">Exit Date</th>}
            <th className="p-2 sm:p-3 md:p-4">Type</th>
            <th className="p-2 sm:p-3 md:p-4">Symbol</th>
            <th className="p-2 sm:p-3 md:p-4">Entry</th>
            {showPositionSize && <th className="p-2 sm:p-3 md:p-4">Position Size</th>}
            <th className="p-2 sm:p-3 md:p-4">SL / CMP</th>
            <th className="p-2 sm:p-3 md:p-4">Status</th>
            <th className="p-2 sm:p-3 md:p-4">R-Earned</th>
            <th className="p-2 sm:p-3 md:p-4">Net PnL</th>
            <th className="p-2 sm:p-3 md:p-4">Days</th>
            <th className="p-2 sm:p-3 md:p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#e5eaf5]">
          {displayTrades.map((t) => {
            const liveR = t.status === 'Open' ? calculateLiveR(t, t.cmp) : t.rMultiple;
            
            let pnl = t.netPnl;
            if (t.status === 'Open') {
              const currentPrice = Number(t.cmp) || t.entry;
              const unrealizedReward = t.isShort ? (t.entry - currentPrice) : (currentPrice - t.entry);
              pnl = (unrealizedReward * t.qty) - t.fees;
            }

            const daysHeld = calculateDays(t.dateObj, t.exitDate);
            const positionSize = (t.entry || 0) * (t.qty || 0);

            return (
              <tr key={t.id} className="hover:bg-[#f8f9fc] transition">
                
                <td className="p-2 sm:p-3 md:p-4 text-[10px] sm:text-xs text-[#a28089] font-medium">
                  {(t.dateObj && !isNaN(t.dateObj.getTime())) ? t.dateObj.toLocaleDateString('en-GB') : 'Invalid'}
                </td>

                {showExitDate && (
                  <td className="p-2 sm:p-3 md:p-4 text-[10px] sm:text-xs text-[#a28089] font-medium">
                    {t.exitDate ? new Date(t.exitDate).toLocaleDateString('en-GB') : '-'}
                  </td>
                )}

                <td className="p-2 sm:p-3 md:p-4">
                  <span className={`text-[9px] sm:text-[10px] px-2 py-1 rounded font-bold ${
                    t.type === 'SHORT' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {t.type}
                  </span>
                </td>

                <td className="p-2 sm:p-3 md:p-4 font-bold text-[#8458B3] text-xs sm:text-sm">
                  {t.symbol}
                </td>

                <td className="p-2 sm:p-3 md:p-4 font-semibold text-[#494D5F] text-xs sm:text-sm">
                  ₹{t.entry}
                </td>

                {showPositionSize && (
                  <td className="p-2 sm:p-3 md:p-4 font-semibold text-[#494D5F] text-xs sm:text-sm">
                    ₹{Math.floor(positionSize).toLocaleString()}
                  </td>
                )}

                <td className="p-2 sm:p-3 md:p-4">
                  <div className="flex flex-col leading-tight">
                    <span className={`text-[9px] sm:text-[10px] font-bold ${
                      t.isRiskFree ? 'text-[#a0d2eb]' : 'text-rose-400'
                    }`}>
                      SL: {t.sl}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-[#a28089]">
                      CMP: {t.cmp || t.entry}
                    </span>
                  </div>
                </td>

                <td className="p-2 sm:p-3 md:p-4">
                  <span className={`px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase ${
                    t.status === 'Win' ? 'bg-emerald-100 text-emerald-600' :
                    t.status === 'Loss' ? 'bg-rose-100 text-rose-600' :
                    t.status === 'BE' ? 'bg-[#e5eaf5] text-[#8458B3]' :
                    'bg-orange-100 text-orange-500'
                  }`}>
                    {t.status}
                  </span>
                </td>

                <td className={`p-2 sm:p-3 md:p-4 font-bold text-xs sm:text-sm ${
                  liveR >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {liveR > 0 ? '+' : ''}{(liveR || 0).toFixed(2)}R
                </td>

                <td className={`p-2 sm:p-3 md:p-4 font-bold text-xs sm:text-sm ${
                  pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  ₹{Math.floor(pnl || 0).toLocaleString()}
                </td>

                <td className="p-2 sm:p-3 md:p-4 text-[10px] sm:text-xs text-[#a28089] font-medium">
                  {daysHeld}
                </td>

                <td className="p-2 sm:p-3 md:p-4">
                  <div className="flex justify-center gap-1 sm:gap-2">
                    {t.status === 'Open' && (
                      <>
                        <button 
                          onClick={() => setEditingTrade(t)} 
                          className="p-1.5 sm:p-2 hover:bg-[#e5eaf5] text-[#8458B3] rounded transition"
                        >
                          <Edit3 size={14}/>
                        </button>
                        <button 
                          onClick={() => handleFinalClose(t)} 
                          className="p-1.5 sm:p-2 hover:bg-emerald-100 text-emerald-600 rounded transition"
                        >
                          <CheckCircle2 size={14}/>
                        </button>
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