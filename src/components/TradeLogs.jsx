// TradeLogs.jsx
import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateLiveR, calculateDays } from '../utils/math';
import EditTradeModal from './EditTradeModal';
import EditQtyModal from './EditQtyModal'; // ✅ NEW
import { Edit3, CheckCircle2, Trash2 } from 'lucide-react';

export default function TradeLogs({ preProcessedData, searchTerm = '', filterStatus = 'All Trades', showExitDate, showPositionSize }) {
  const { trades, updateTrade, settings, deleteTrade } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);
  const [editingQtyTrade, setEditingQtyTrade] = useState(null); // ✅ NEW

  const safeSearchTerm = (searchTerm || '').toLowerCase();

  const displayTrades = (preProcessedData || trades)
    .sort((a, b) => {
      const aDate = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date);
      const bDate = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date);
      return bDate - aDate;
    })
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this trade?');
    if (!confirmDelete) return;
    await deleteTrade(id);
  };

  return (
    <div className="w-full overflow-x-auto border border-gray-300">
      <table className="w-full border-collapse bg-white divide-x divide-gray-300 divide-y divide-gray-300">
        
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">Date</th>
            {showExitDate && <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">Exit Date</th>}
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">Type</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">Symbol</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">Entry</th>
            {showPositionSize && <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">Position Size</th>}
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">QTY</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">SL / CMP</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">Status</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">R-Earned</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">Net PnL</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">Days</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-300">
          {displayTrades.map((t) => {

            const remainingQty = t.remainingQty ?? t.qty;
            const bookedQty = t.bookedQty ?? 0;

            return (
              <tr key={t.id} className="hover:bg-gray-50">

                <td className="px-3 py-2 border text-center text-sm">
                  {(t.date?.seconds ? new Date(t.date.seconds * 1000) : new Date(t.date)).toLocaleDateString('en-GB')}
                </td>

                {showExitDate && (
                  <td className="px-3 py-2 border text-center text-sm">
                    {t.exitDate ? new Date(t.exitDate).toLocaleDateString('en-GB') : '-'}
                  </td>
                )}

                <td className="px-3 py-2 border text-center">
                  {t.type}
                </td>

                <td className="px-3 py-2 border text-center font-bold text-[#8458B3]">
                  {t.symbol}
                </td>

                <td className="px-3 py-2 border text-center">
                  ₹{t.entry}
                </td>

                {showPositionSize && (
                  <td className="px-3 py-2 border text-center">
                    ₹{Math.floor((t.entry || 0) * (t.qty || 0))}
                  </td>
                )}

                {/* ✅ UPDATED QTY COLUMN */}
                <td className="px-3 py-2 border text-center">
                  <div className="flex items-center justify-center gap-2">
                    
                    <span>
                      {t.qty} → {bookedQty} | {remainingQty}
                    </span>

                    {t.status === 'Open' && (
                      <button onClick={() => setEditingQtyTrade(t)}>
                        <Edit3 size={14} className="text-[#8458B3]" />
                      </button>
                    )}

                  </div>
                </td>

                <td className="px-3 py-2 border text-center">
                  SL: {t.sl} | CMP: {t.cmp}
                </td>

                <td className="px-3 py-2 border text-center">
                  {t.status}
                </td>

                <td className="px-3 py-2 border text-center">
                  {(t.rMultiple || 0).toFixed(2)}R
                </td>

                <td className="px-3 py-2 border text-center">
                  ₹{Math.floor(t.netPnl || 0)}
                </td>

                <td className="px-3 py-2 border text-center">
                  {calculateDays(new Date(t.date), t.exitDate)}
                </td>

                <td className="px-3 py-2 border text-center">
                  <div className="flex justify-center gap-2">

                    {t.status === 'Open' && (
                      <>
                        <button onClick={() => setEditingTrade(t)}>
                          <Edit3 size={14}/>
                        </button>

                        <button onClick={() => handleFinalClose(t)}>
                          <CheckCircle2 size={14}/>
                        </button>
                      </>
                    )}

                    <button onClick={() => handleDelete(t.id)}>
                      <Trash2 size={14}/>
                    </button>

                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>

      {editingTrade && <EditTradeModal trade={editingTrade} onClose={() => setEditingTrade(null)} />}

      {/* ✅ NEW MODAL */}
      {editingQtyTrade && (
        <EditQtyModal 
          trade={editingQtyTrade} 
          onClose={() => setEditingQtyTrade(null)} 
        />
      )}
    </div>
  );
}