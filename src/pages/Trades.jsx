import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateDays, calculateLiveR } from '../utils/math';
import EditTradeModal from '../components/EditTradeModal';
import { Edit3, CheckCircle2, Trash2, Filter } from 'lucide-react';

export default function Trades() {
  const { trades, deleteTrade, updateTrade, settings } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);
  const [filter, setFilter] = useState('All');

  const handleCloseTrade = async (trade) => {
    const exit = prompt(`Exit Price for ${trade.symbol}:`, trade.cmp || trade.entry);
    if (!exit) return;
    const r = calculateLiveR(trade, exit);
    let status = 'BE';
    if (r > 0.1) status = 'Win'; else if (r < -0.1) status = 'Loss';
    
    await updateTrade(trade.id, { 
      exitPrice: parseFloat(exit), 
      exitDate: new Date().toISOString(), 
      rMultiple: r, status, cmp: parseFloat(exit) 
    });
  };

  const filteredTrades = trades.filter(t => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  return (
    // DARK GLASSMORPHISM CONTAINER
    <div className="bg-[#0B1320]/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-500">
      
      {/* HEADER & FILTER */}
      <div className="p-4 bg-[#0A111C] border-b border-slate-800 flex gap-4 items-center justify-between">
        <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest ml-2">Trade History</h2>
        <div className="flex gap-2 items-center">
          <Filter size={16} className="text-slate-500"/>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 bg-[#050B14] outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Trades</option>
            <option value="Open">Open Positions</option>
            <option value="Win">Winners</option>
            <option value="Loss">Losers</option>
            <option value="BE">Breakeven</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* CENTERED EXCEL-LIKE TEXT PRESERVED HERE */}
        <table className="w-full text-center whitespace-nowrap">
          <thead>
            <tr className="bg-[#050B14] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
              <th className="py-4 px-4">#</th>
              <th className="py-4 px-4">Symbol</th>
              <th className="py-4 px-4">Entry Date</th>
              <th className="py-4 px-4">Exit Date</th>
              <th className="py-4 px-4">Size / Qty</th>
              <th className="py-4 px-4">Entry</th>
              <th className="py-4 px-4">SL / CMP</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">R-Earned</th>
              <th className="py-4 px-4">Net Profit</th>
              <th className="py-4 px-4">Days</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-slate-300 divide-y divide-slate-800/50">
            {filteredTrades.map((t, i) => {
              const rpt = parseFloat(t.riskAmount) || parseFloat(settings?.rValue) || 1250;
              const liveR = t.status === 'Open' ? calculateLiveR(t, t.cmp || t.entry) : t.rMultiple;
              const netPnl = liveR * rpt;
              const exitStr = t.exitDate ? new Date(t.exitDate).toLocaleDateString('en-GB', {day:'2-digit', month:'short'}) : '-';

              return (
                <tr key={t.id} className="hover:bg-blue-900/10 transition-colors group">
                  <td className="py-4 px-4 text-slate-500 text-xs">{filteredTrades.length - i}</td>
                  <td className="py-4 px-4 text-blue-400 font-black tracking-tight">{t.symbol}</td>
                  <td className="py-4 px-4 text-slate-400 text-xs">{new Date(t.date.seconds * 1000).toLocaleDateString('en-GB', {day:'2-digit', month:'short'})}</td>
                  <td className="py-4 px-4 text-slate-400 text-xs">{exitStr}</td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-200">₹{(t.quantity * t.entry).toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{t.quantity} Qty</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4 text-slate-300">₹{t.entry}</td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-col text-[11px] items-center">
                      <span className={t.isRiskFree ? 'text-emerald-400' : 'text-rose-400'}>SL: {t.sl}</span>
                      <span className="text-slate-500 mt-1">CMP: {t.cmp || t.entry}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 align-middle">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      t.status === 'Win' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' : 
                      t.status === 'Loss' ? 'bg-rose-900/30 text-rose-400 border-rose-800/50' : 
                      t.status === 'Open' ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' : 
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>{t.status}</span>
                  </td>

                  <td className={`py-4 px-4 font-black text-base ${liveR >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{liveR > 0 ? '+' : ''}{liveR.toFixed(2)}R</td>
                  <td className={`py-4 px-4 font-black ${netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>₹{Math.floor(netPnl).toLocaleString()}</td>
                  <td className="py-4 px-4 text-slate-500 text-xs">{calculateDays(new Date(t.date.seconds * 1000), t.exitDate)}</td>
                  
                  <td className="py-4 px-4">
                    {/* EDIT, CLOSE, TRASH BUTTONS - EXACTLY AS PREVIOUS */}
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingTrade(t)} className="p-2 bg-[#050B14] border border-slate-700 rounded-lg text-slate-400 hover:text-blue-400 hover:border-blue-500 shadow-sm transition-all"><Edit3 size={14}/></button>
                      {t.status === 'Open' && <button onClick={() => handleCloseTrade(t)} className="p-2 bg-[#050B14] border border-slate-700 rounded-lg text-slate-400 hover:text-emerald-400 hover:border-emerald-500 shadow-sm transition-all"><CheckCircle2 size={14}/></button>}
                      <button onClick={() => deleteTrade(t.id)} className="p-2 bg-[#050B14] border border-slate-700 rounded-lg text-slate-400 hover:text-rose-400 hover:border-rose-500 shadow-sm transition-all"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editingTrade && <EditTradeModal trade={editingTrade} onClose={() => setEditingTrade(null)} />}
    </div>
  );
}