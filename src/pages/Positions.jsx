import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { calculatePositionsMetrics } from '../utils/math';
import EditTradeModal from '../components/EditTradeModal';
import { Edit3 } from 'lucide-react';

export default function Positions() {
  const { trades, settings } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);
  const openTrades = trades.filter(t => t.status === 'Open');
  const globalR = parseFloat(settings?.rValue) || 1250;
  const pm = calculatePositionsMetrics(trades, globalR);

  const Stat = ({ label, val, sub, c = "text-slate-900" }) => (
    <div className="p-5 border-r border-slate-200 last:border-0 flex-1">
      <p className="text-[11px] font-black text-slate-400 uppercase mb-2 tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2">
        <h2 className={`text-2xl font-black tracking-tight ${c}`}>{val.toLocaleString(undefined, {maximumFractionDigits:0})}</h2>
        {sub && <span className="text-[10px] font-bold text-slate-400 uppercase">{sub}</span>}
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm">
      <div className="flex border-b border-slate-200 bg-[#fafafa]">
        <Stat label="Exposure" val={pm.exposure} />
        <Stat label="Open Risk" val={-pm.openRiskMoney} sub={`(-${pm.openRiskR.toFixed(1)}R)`} />
        <Stat label="Unrealised Gains" val={pm.unrealisedMoney} c="text-green-600" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase border-b border-slate-200 tracking-tighter">
              <th className="p-3 border-r border-slate-200">#</th>
              <th className="p-3 border-r border-slate-200">Symbol</th>
              <th className="p-3 border-r border-slate-200">Current SL</th>
              <th className="p-3 border-r border-slate-200">Exposure</th>
              <th className="p-3 border-r border-slate-200">Open Risk R</th>
              <th className="p-3 border-r border-slate-200">CMP</th>
              <th className="p-3">Unrealised</th>
            </tr>
          </thead>
          <tbody className="text-[13px] font-bold text-slate-700">
            {openTrades.map((t, i) => {
              const rpt = parseFloat(t.riskAmount) || globalR;
              const cmp = t.cmp || t.entry;
              const riskR = Math.max(0, (t.entry - t.sl) * t.quantity) / rpt;
              const unrealised = (cmp - t.entry) * t.quantity;
              return (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 border-r border-slate-100 text-slate-400 text-xs">{openTrades.length - i}</td>
                  <td className="p-3 border-r border-slate-100 text-blue-600 font-black italic">{t.symbol}</td>
                  <td className="p-3 border-r border-slate-100 flex items-center justify-center gap-2">
                    {t.sl} <button onClick={() => setEditingTrade(t)}><Edit3 size={12}/></button>
                  </td>
                  <td className="p-3 border-r border-slate-100">₹{(cmp * t.quantity).toLocaleString()}</td>
                  <td className="p-3 border-r border-slate-100 text-red-500">-{riskR.toFixed(2)}R</td>
                  <td className="p-3 border-r border-slate-100 flex items-center justify-center gap-2">
                    {cmp} <button onClick={() => setEditingTrade(t)}><Edit3 size={12}/></button>
                  </td>
                  <td className={`p-3 font-black ${unrealised >= 0 ? 'text-green-600' : 'text-red-500'}`}>₹{Math.floor(unrealised).toLocaleString()}</td>
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