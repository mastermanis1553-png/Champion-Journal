// TradeLogs.jsx
import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateLiveR, calculateDays } from '../utils/math';
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
            const liveR = t.status === 'Open' ? calculateLiveR(t, t.cmp) : t.rMultiple;

            const remainingQty = t.remainingQty ?? t.qty;
            const bookedQty = t.bookedQty ?? 0;

            let pnl = t.netPnl;
            if (t.status === 'Open') {
              const currentPrice = Number(t.cmp) || t.entry;

              const unrealized = t.isShort 
                ? (t.entry - currentPrice) * remainingQty
                : (currentPrice - t.entry) * remainingQty;

              // ✅ FIXED LOGIC (ONLY CHANGE)
              const realized = (t.partials || []).reduce((sum, p) => {
                if (t.isShort) {
                  return sum + (t.entry - p.price) * p.qty;
                } else {
                  return sum + (p.price - t.entry) * p.qty;
                }
              }, 0);

              pnl = realized + unrealized - t.fees;
            }

            const daysHeld = calculateDays(
              t.date?.seconds ? new Date(t.date.seconds * 1000) : new Date(t.date),
              t.exitDate
            );

            const effectiveQty = t.remainingQty ?? t.qty;
            const positionSize = (t.entry || 0) * effectiveQty;

            return (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                
                {/* UI SAME AS BEFORE — NO CHANGE */}

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
                  <div className="flex items-center justify-center gap-2">
                    {t.qty} → {remainingQty} | {bookedQty}
                    {t.status === 'Open' && (
                      <button onClick={() => setEditingQtyTrade(t)}>
                        <Edit3 size={14} className="text-[#8458B3]" />
                      </button>
                    )}
                  </div>
                </td>

                {/* rest UI unchanged */}