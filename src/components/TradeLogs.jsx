// TradeLogs.jsx
import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateLiveR, calculateDays } from '../utils/math';
import EditTradeModal from './EditTradeModal';
import { Edit3, CheckCircle2, Trash2, Info } from 'lucide-react';

export default function TradeLogs({ preProcessedData, searchTerm = '', filterStatus = 'All Trades', showExitDate, showPositionSize }) {
  const { trades, updateTrade, settings, deleteTrade } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);

  // ✅ NEW STATE FOR INLINE QTY EDIT
  const [editingQtyTrade, setEditingQtyTrade] = useState(null);
  const [tempQty, setTempQty] = useState('');
  const [tempBookedQty, setTempBookedQty] = useState('');

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

  // ✅ SAVE QTY EDIT
  const handleQtySave = async (trade) => {
    const total = parseFloat(tempQty) || trade.qty;
    const booked = parseFloat(tempBookedQty) || 0;

    if (booked > total) {
      alert('Booked qty cannot exceed total qty');
      return;
    }

    const remaining = total - booked;

    await updateTrade(trade.id, {
      qty: total,
      bookedQty: booked,
      remainingQty: remaining
    });

    setEditingQtyTrade(null);
  };

  return (
    <div className="w-full overflow-x-auto border border-gray-300">
      <table className="w-full border-collapse bg-white divide-x divide-gray-300 divide-y divide-gray-300">
        
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">Date</th>
            {showExitDate && <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">Exit Date</th>}
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">Type</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">Symbol</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">Entry</th>
            {showPositionSize && <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">Position Size</th>}
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">QTY</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">SL / CMP</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">Status</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">R-Earned</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">Net PnL</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">Days</th>
            <th className="px-3 py-2 border border-gray-300 text-center text-xs font-semibold text-[#494D5F] uppercase tracking-wider whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-300">
          {displayTrades.map((t) => {

            const remainingQty = t.remainingQty ?? t.qty;
            const bookedQty = t.bookedQty ?? 0;

            const effectiveQty = t.qty;
            const positionSize = (t.entry || 0) * effectiveQty;

            let pnl = t.netPnl;
            if (t.status === 'Open') {
              const currentPrice = Number(t.cmp) || t.entry;

              const unrealized = (currentPrice - t.entry) * remainingQty;
              const realized = (currentPrice - t.entry) * bookedQty;

              pnl = unrealized + realized;
            }

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

                <td className="px-3 py-2 border text-center">{t.type}</td>
                <td className="px-3 py-2 border text-center font-bold">{t.symbol}</td>
                <td className="px-3 py-2 border text-center">₹{t.entry}</td>

                {showPositionSize && (
                  <td className="px-3 py-2 border text-center">₹{Math.floor(positionSize)}</td>
                )}

                {/* 🔥 QTY COLUMN UPDATED */}
                <td className="px-3 py-2 border text-center text-sm">
                  
                  {editingQtyTrade?.id === t.id ? (
                    <div className="flex flex-col gap-1 items-center">

                      <input
                        type="number"
                        value={tempQty}
                        onChange={(e) => setTempQty(e.target.value)}
                        className="border p-1 w-16 text-xs"
                        placeholder="Qty"
                      />

                      <input
                        type="number"
                        value={tempBookedQty}
                        onChange={(e) => setTempBookedQty(e.target.value)}
                        className="border p-1 w-16 text-xs"
                        placeholder="Booked"
                      />

                      <div className="text-xs text-gray-500">
                        Rem: {(tempQty || t.qty) - (tempBookedQty || 0)}
                      </div>

                      <button
                        onClick={() => handleQtySave(t)}
                        className="text-xs text-green-600"
                      >
                        Save
                      </button>

                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">

                      <span>
                        {t.qty} → {remainingQty} | {bookedQty}
                      </span>

                      <button
                        onClick={() => {
                          setEditingQtyTrade(t);
                          setTempQty(t.qty);
                          setTempBookedQty(bookedQty);
                        }}
                        className="text-[#a28089] hover:text-[#8458B3]"
                      >
                        <Edit3 size={12}/>
                      </button>

                      {/* 🔥 INFO BUTTON */}
                      <button
                        title={`Total: ${t.qty}, Remaining: ${remainingQty}, Booked: ${bookedQty}`}
                        className="text-[#a28089]"
                      >
                        <Info size={12}/>
                      </button>

                    </div>
                  )}

                </td>

                <td className="px-3 py-2 border text-center text-xs">
                  SL: {t.sl} <br/> CMP: {t.cmp}
                </td>

                <td className="px-3 py-2 border text-center">{t.status}</td>

                <td className="px-3 py-2 border text-center">{t.rMultiple}</td>

                <td className="px-3 py-2 border text-center">₹{Math.floor(pnl)}</td>

                <td className="px-3 py-2 border text-center">
                  {calculateDays(
                    t.date?.seconds ? new Date(t.date.seconds * 1000) : new Date(t.date),
                    t.exitDate
                  )}
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
    </div>
  );
}