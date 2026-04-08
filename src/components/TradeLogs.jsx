import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateLiveR } from '../utils/math';
import EditTradeModal from './EditTradeModal';
import { Edit3, CheckCircle2, Trash2 } from 'lucide-react';

export default function TradeLogs() {
  const { trades, updateTrade, deleteTrade } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);

  const handleFinalClose = async (trade) => {
    const exit = prompt(`Enter Exit Price for ${trade.symbol}:`, trade.cmp || trade.entry);
    if (!exit) return;

    const exitPrice = parseFloat(exit);
    const rMultiple = calculateLiveR(trade, exitPrice);

    let status = 'BE';
    if (rMultiple > 0.1) status = 'Win';
    if (rMultiple < -0.1) status = 'Loss';

    await updateTrade(trade.id, { exitPrice, rMultiple, status, cmp: exitPrice });
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border-2 border-[#d0bdf4]">
      <table className="w-full text-center border-collapse">
        <thead>
          <tr className="bg-[#f8fafc] text-[#8458B3] text-xs uppercase font-black tracking-widest border-b-2 border-[#d0bdf4]">
            <th className="p-4">Date</th>
            <th className="p-4">Symbol</th>
            <th className="p-4">Pos. Size / Qty</th>
            <th className="p-4">Entry</th>
            <th className="p-4">SL / CMP</th>
            <th className="p-4">Status</th>
            <th className="p-4">R-Earned</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm font-semibold">
          {trades.map((t) => {
            const liveR = t.status === 'Open' ? calculateLiveR(t, t.cmp || t.entry) : t.rMultiple;
            const posSize = t.quantity * t.entry;

            return (
              <tr key={t.id} className="hover:bg-[#f8fafc] transition-colors border-b border-[#e5eaf5]">
                <td className="p-4 text-[#a28089] text-xs">{new Date(t.date.seconds * 1000).toLocaleDateString('en-GB')}</td>
                <td className="p-4 font-black text-[#8458B3]">{t.symbol}</td>
                <td className="p-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[#333] font-bold">₹{posSize.toLocaleString()}</span>
                    <span className="text-xs text-[#a28089]">{t.quantity} Qty</span>
                  </div>
                </td>
                <td className="p-4 text-[#333] font-bold">₹{t.entry}</td>
                <td className="p-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-[#333]">SL: ₹{t.sl} {t.isRiskFree && '(RF)'}</span>
                    <span className="text-xs font-bold text-[#a28089] mt-1">CMP: ₹{t.cmp || t.entry}</span>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <span className="px-3 py-1 rounded-lg text-xs font-black uppercase border-2 border-[#d0bdf4] text-[#8458B3] bg-[#a0d2eb]/20">
                    {t.status}
                  </span>
                </td>
                <td className="p-4 font-black text-base text-[#333]">
                  {liveR > 0 ? '+' : ''}{liveR.toFixed(2)}R
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-3 text-[#a28089]">
                    <button onClick={() => setEditingTrade(t)} className="hover:text-[#8458B3] transition-colors" title="Edit Position"><Edit3 size={18} /></button>
                    {t.status === 'Open' && (
                      <button onClick={() => handleFinalClose(t)} className="hover:text-[#8458B3] transition-colors" title="Close Trade"><CheckCircle2 size={18} /></button>
                    )}
                    <button onClick={() => deleteTrade(t.id)} className="hover:text-[#8458B3] transition-colors" title="Delete"><Trash2 size={18} /></button>
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