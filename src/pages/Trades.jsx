import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateDays, getTradeMetrics } from '../utils/math';
import EditTradeModal from '../components/EditTradeModal';
import { Edit3, CheckCircle2, Trash2, Filter } from 'lucide-react';

export default function Trades() {
  const { trades, deleteTrade, updateTrade, settings } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);
  const [filter, setFilter] = useState('All');

  const handleCloseTrade = async (trade) => {
    const exit = prompt(`Exit Price for ${trade.symbol}:`, trade.cmp || trade.entry);
    if (!exit) return;

    const exitPrice = parseFloat(exit);
    const metrics = getTradeMetrics({ ...trade, cmp: exitPrice });

    let status = 'BE';
    if (metrics && metrics.r > 0.1) status = 'Win';
    if (metrics && metrics.r < -0.1) status = 'Loss';

    await updateTrade(trade.id, {
      exitPrice,
      exitDate: new Date().toISOString(),
      cmp: exitPrice,
      status
    });
  };

  const filteredTrades = trades.filter(t => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[#8458B3] uppercase tracking-tight" style={{ fontStyle: 'normal' }}>
          Trade <span className="text-[#a0d2eb]">History</span>
        </h1>
        <p className="text-[#a28089] text-sm mt-3 font-medium">Complete log of all executed positions with real-time metrics</p>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] rounded-2xl shadow-lg overflow-hidden">
        
        {/* FILTER BAR */}
        <div className="p-6 bg-[#f8fafc] border-b-2 border-[#d0bdf4] flex gap-4 items-center justify-between">
          <h2 className="text-sm font-black text-[#8458B3] uppercase tracking-widest">Filter Results</h2>
          <div className="flex gap-2 items-center">
            <Filter size={16} className="text-[#a28089]" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border-2 border-[#d0bdf4] rounded-xl px-4 py-2 text-xs font-bold text-[#8458B3] bg-white outline-none focus:ring-2 focus:ring-[#8458B3] cursor-pointer"
            >
              <option value="All">All Trades</option>
              <option value="Open">Open Positions</option>
              <option value="Win">Winners</option>
              <option value="Loss">Losers</option>
              <option value="BE">Breakeven</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-center whitespace-nowrap">
            <thead>
              <tr className="bg-[#f8fafc] text-[#8458B3] text-xs font-black uppercase tracking-widest border-b-2 border-[#d0bdf4]">
                <th className="py-4 px-4">#</th>
                <th className="py-4 px-4">Symbol</th>
                <th className="py-4 px-4">Entry Date</th>
                <th className="py-4 px-4">Exit Date</th>
                <th className="py-4 px-4">Entry / CMP</th>
                <th className="py-4 px-4">SL / Qty</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">R-Earned</th>
                <th className="py-4 px-4">Net P&L</th>
                <th className="py-4 px-4">Days</th>
                <th className="py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-[#1a1a2e] divide-y divide-[#e5eaf5]">
              {filteredTrades.map((t, i) => {
                const metrics = getTradeMetrics(t);
                if (!metrics) return null;

                const exitStr = t.exitDate 
                  ? new Date(t.exitDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                  : '-';
                const entryStr = new Date(t.date.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

                return (
                  <tr key={t.id} className="hover:bg-[#f8fafc] transition-colors group">
                    <td className="py-4 px-4 text-[#a28089] text-xs">{filteredTrades.length - i}</td>
                    <td className="py-4 px-4 text-[#8458B3] font-black tracking-tight">{t.symbol}</td>
                    <td className="py-4 px-4 text-[#a28089] text-xs">{entryStr}</td>
                    <td className="py-4 px-4 text-[#a28089] text-xs">{exitStr}</td>
                    
                    <td className="py-4 px-4 text-[#1a1a2e]">
                      <div className="flex flex-col items-center">
                        <span>₹{t.entry}</span>
                        <span className="text-xs text-[#a28089]">CMP: ₹{t.cmp || t.entry}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4 text-[#1a1a2e]">
                      <div className="flex flex-col items-center">
                        <span className={t.isRiskFree ? 'text-emerald-600 font-black' : 'text-rose-600 font-black'}>SL: ₹{t.sl}</span>
                        <span className="text-xs text-[#a28089] mt-1">{t.quantity} Qty</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase border-2 ${
                        t.status === 'Win' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 
                        t.status === 'Loss' ? 'bg-rose-100 text-rose-700 border-rose-300' : 
                        t.status === 'Open' ? 'bg-[#a0d2eb]/30 text-[#8458B3] border-[#a0d2eb]' : 
                        'bg-[#e5eaf5] text-[#a28089] border-[#d0bdf4]'
                      }`}>{t.status}</span>
                    </td>

                    <td className={`py-4 px-4 font-black text-base ${metrics.r >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {metrics.r > 0 ? '+' : ''}{metrics.r.toFixed(2)}R
                    </td>
                    
                    <td className={`py-4 px-4 font-black ${metrics.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ₹{Math.floor(metrics.pnl).toLocaleString()}
                    </td>
                    
                    <td className="py-4 px-4 text-[#a28089] text-xs">{calculateDays(new Date(t.date.seconds * 1000), t.exitDate)}</td>
                    
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingTrade(t)} className="p-2 bg-white border-2 border-[#d0bdf4] rounded-lg text-[#a28089] hover:text-[#8458B3] hover:border-[#8458B3] shadow-sm transition-all"><Edit3 size={16} /></button>
                        {t.status === 'Open' && <button onClick={() => handleCloseTrade(t)} className="p-2 bg-white border-2 border-emerald-300 rounded-lg text-emerald-600 hover:text-emerald-700 shadow-sm transition-all"><CheckCircle2 size={16} /></button>}
                        <button onClick={() => deleteTrade(t.id)} className="p-2 bg-white border-2 border-rose-300 rounded-lg text-rose-600 hover:text-rose-700 shadow-sm transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {editingTrade && <EditTradeModal trade={editingTrade} onClose={() => setEditingTrade(null)} />}
    </div>
  );
}