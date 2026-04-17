// TradeLogs.jsx
import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateDays } from '../utils/math';
import EditTradeModal from './EditTradeModal';
import EditQtyModal from './EditQtyModal';
import { Edit3, CheckCircle2, Trash2 } from 'lucide-react';

export default function TradeLogs({ preProcessedData, searchTerm = '', filterStatus = 'All Trades', showExitDate, showPositionSize }) {
  const { trades, updateTrade, settings, deleteTrade } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);
  const [editingQtyTrade, setEditingQtyTrade] = useState(null);

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
            const entry = Number(t.entry) || 0;
            const qty = Number(t.qty) || 0;
            const positionSize = entry * qty;

            const remainingQty = t.remainingQty ?? t.qty;

            const daysHeld = calculateDays(
              t.date?.seconds ? new Date(t.date.seconds * 1000) : new Date(t.date),
              t.exitDate
            );

            return (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 border border-gray-300 text-center text-sm text-[#494D5F] whitespace-nowrap">
                  {(t.date?.seconds ? new Date(t.date.seconds * 1000) : new Date(t.date)).toLocaleDateString('en-GB')}
                </td>

                {showExitDate && (
                  <td className="px-3 py-2 border border-gray-300 text-center text-sm text-[#494D5F] whitespace-nowrap">
                    {t.exitDate ? new Date(t.exitDate).toLocaleDateString('en-GB') : '-'}
                  </td>
                )}

                <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    t.type === 'SHORT' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {t.type}
                  </span>
                </td>

                <td className="px-3 py-2 border border-gray-300 text-center text-sm font-bold text-[#8458B3] whitespace-nowrap">
                  {t.symbol}
                </td>

                <td className="px-3 py-2 border border-gray-300 text-center text-sm font-semibold text-[#494D5F] whitespace-nowrap">
                  ₹{t.entry}
                </td>

                {showPositionSize && (
                  <td className="px-3 py-2 border border-gray-300 text-center text-sm font-semibold text-[#494D5F] whitespace-nowrap">
                    ₹{Math.floor(positionSize).toLocaleString()}
                  </td>
                )}

                <td className="px-3 py-2 border border-gray-300 text-center text-sm font-semibold text-[#494D5F] whitespace-nowrap">
                  {t.qty} → {remainingQty}
                </td>

                <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap">
                  <div className="flex flex-col leading-tight items-center">
                    <span className="text-[10px] font-bold text-rose-400">
                      SL: {t.sl}
                    </span>
                    <span className="text-[10px] font-semibold text-[#a28089]">
                      CMP: {t.cmp || t.entry}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap">
                  {t.status}
                </td>

                <td className="px-3 py-2 border border-gray-300 text-center text-sm font-bold whitespace-nowrap">
                  0.00R
                </td>

                <td className="px-3 py-2 border border-gray-300 text-center text-sm font-bold whitespace-nowrap">
                  ₹0
                </td>

                <td className="px-3 py-2 border border-gray-300 text-center text-sm text-[#494D5F] whitespace-nowrap">
                  {daysHeld}
                </td>

                <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setEditingTrade(t)}>
                      <Edit3 size={14}/>
                    </button>
                    <button onClick={() => setEditingQtyTrade(t)}>
                      <Edit3 size={14}/>
                    </button>
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

      {editingQtyTrade && (
        <EditQtyModal 
          trade={editingQtyTrade} 
          onClose={() => setEditingQtyTrade(null)} 
        />
      )}
    </div>
  );
}