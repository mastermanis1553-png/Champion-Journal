import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateDays, calculateLiveR } from '../utils/math';
import EditTradeModal from '../components/EditTradeModal';
import { Edit3, CheckCircle2, Trash2, Filter } from 'lucide-react';

export default function Trades() {
  const { trades, deleteTrade, updateTrade, settings } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);
  const [filter, setFilter] = useState('All'); // FILTER STATE

  const handleCloseTrade = async (trade) => {
    const exit = prompt(`Exit Price for ${trade.symbol}:`, trade.cmp || trade.entry);
    if (!exit) return;
    const r = calculateLiveR(trade, exit);
    let status = 'BE';
    if (r > 0.1) status = 'Win'; else if (r < -0.1) status = 'Loss';
    
    // Setting exitDate
    await updateTrade(trade.id, { 
      exitPrice: parseFloat(exit), 
      exitDate: new Date().toISOString(), 
      rMultiple: r, status, cmp: parseFloat(exit) 
    });
  };

  // FILTER LOGIC
  const filteredTrades = trades.filter(t => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden animate-in fade-in duration-500">
      
      <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex gap-4 items-center justify-between">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest ml-2">Trade History</h2>
        <div className="flex gap-2 items-center">
          <Filter size={16} className="text-slate-400"/>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 bg-white outline-none shadow-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
        <table className="w-full text-center whitespace-nowrap">
          <thead>
            <tr className="bg-slate-100/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
              <th className="py-4 px-4">#</th>
              <th className="py-4 px-4">Symbol</th>
              <th className="py-4 px-4">Entry Date</th>
              <th className="py-4 px-4">Exit Date</th> {/* NEW COLUMN */}
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
          <tbody className="text-sm font-bold text-slate-700 divide-y divide-slate-100">
            {filteredTrades.map((t, i) => {
              const rpt = parseFloat(t.riskAmount) || parseFloat(settings?.rValue) || 1250;
              const liveR = t.status === 'Open' ? calculateLiveR(t, t.cmp || t.entry) : t.rMultiple;
              const netPnl = liveR * rpt;
              const exitStr = t.exitDate ? new Date(t.exitDate).toLocaleDateString('en-GB', {day:'2-digit', month:'short'}) : '-';

              return (
                <tr key={t.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="py-4 px-4 text-slate-400 text-xs">{filteredTrades.length - i}</td>
                  <td className="py-4 px-4 text-blue-600 font-black tracking-tight">{t.symbol}</td>
                  <td className="py-4 px-4 text-slate-500 text-xs">{new Date(t.date.seconds * 1000).toLocaleDateString('en-GB', {day:'2-digit', month:'short'})}</td>
                  <td className="py-4 px-4 text-slate-500 text-xs">{exitStr}</td> {/* NEW DATA */}
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-800">₹{(t.quantity * t.entry).toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{t.quantity} Qty</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">₹{t.entry}</td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-col text-[11px] items-center">
                      <span className={t.isRiskFree ? 'text-emerald-500' : 'text-rose-500'}>SL: {t.sl}</span>
                      <span className="text-slate-400 mt-1">CMP: {t.cmp || t.entry}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 align-middle">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${t.status === 'Win' ? 'bg-emerald-100 text-emerald-700' : t.status === 'Loss' ? 'bg-rose-100 text-rose-700' : t.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{t.status}</span>
                  </td>

                  <td className={`py-4 px-4 font-black text-base ${liveR >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{liveR > 0 ? '+' : ''}{liveR.toFixed(2)}R</td>
                  <td className={`py-4 px-4 font-black ${netPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>₹{Math.floor(netPnl).toLocaleString()}</td>
                  <td className="py-4 px-4 text-slate-500 text-xs">{calculateDays(new Date(t.date.seconds * 1000), t.exitDate)}</td>
                  
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingTrade(t)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 shadow-sm transition-all"><Edit3 size={14}/></button>
                      {t.status === 'Open' && <button onClick={() => handleCloseTrade(t)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-600 shadow-sm transition-all"><CheckCircle2 size={14}/></button>}
                      <button onClick={() => deleteTrade(t.id)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 shadow-sm transition-all"><Trash2 size={14}/></button>
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