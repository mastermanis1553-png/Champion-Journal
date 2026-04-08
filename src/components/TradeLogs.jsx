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
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table className="w-full text-center border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
            <th className="p-4 border-b border-slate-200">Date</th>
            <th className="p-4 border-b border-slate-200">Symbol</th>
            <th className="p-4 border-b border-slate-200">Pos. Size / Qty</th>
            <th className="p-4 border-b border-slate-200">Entry</th>
            <th className="p-4 border-b border-slate-200">SL / CMP</th>
            <th className="p-4 border-b border-slate-200">Status</th>
            <th className="p-4 border-b border-slate-200">R-Earned</th>
            <th className="p-4 border-b border-slate-200">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm font-semibold">
          {trades.map((t) => {
            const liveR = t.status === 'Open' ? calculateLiveR(t, t.cmp || t.entry) : t.rMultiple;
            const posSize = t.quantity * t.entry;

            return (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 border-b border-slate-100 text-slate-500 text-xs">{new Date(t.date.seconds * 1000).toLocaleDateString('en-GB')}</td>
                <td className="p-4 border-b border-slate-100 font-black text-slate-900">{t.symbol}</td>
                <td className="p-4 border-b border-slate-100">
                  <div className="flex flex-col items-center">
                    <span className="text-slate-900 font-bold">₹{posSize.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">{t.quantity} Qty</span>
                  </div>
                </td>
                <td className="p-4 border-b border-slate-100 text-slate-900 font-bold">₹{t.entry}</td>
                <td className="p-4 border-b border-slate-100">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-900">SL: ₹{t.sl} {t.isRiskFree && '(RF)'}</span>
                    <span className="text-xs font-bold text-slate-500 mt-1">CMP: ₹{t.cmp || t.entry}</span>
                  </div>
                </td>
                <td className="p-4 border-b border-slate-100 align-middle">
                  <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase border border-slate-300 text-slate-900 bg-white">
                    {t.status}
                  </span>
                </td>
                <td className="p-4 border-b border-slate-100 font-black text-base text-slate-900">
                  {liveR > 0 ? '+' : ''}{liveR.toFixed(2)}R
                </td>
                <td className="p-4 border-b border-slate-100">
                  <div className="flex justify-center gap-3 text-slate-500">
                    <button onClick={() => setEditingTrade(t)} className="hover:text-slate-900 transition" title="Edit Position"><Edit3 size={18} /></button>
                    {t.status === 'Open' && (
                      <button onClick={() => handleFinalClose(t)} className="hover:text-slate-900 transition" title="Close Trade"><CheckCircle2 size={18} /></button>
                    )}
                    <button onClick={() => deleteTrade(t.id)} className="hover:text-slate-900 transition" title="Delete"><Trash2 size={18} /></button>
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