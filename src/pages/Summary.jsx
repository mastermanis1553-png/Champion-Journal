import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { groupTrades, calculateMetrics } from '../utils/math';

export default function Summary() {
  const { trades, settings } = useTrades();
  const [tab, setTab] = useState('Quarterly');
  const groups = groupTrades(trades, tab);
  const keys = Object.keys(groups).sort().reverse();

  const Row = ({ label, func, color = "text-slate-300", isR = false, isP = false }) => (
    <tr>
      <td className="p-4 font-bold text-slate-400 bg-slate-900 border border-slate-700 text-[11px] uppercase tracking-wider">{label}</td>
      {keys.map(k => {
        const m = calculateMetrics(groups[k], settings?.rValue || 1250);
        const val = func(m, groups[k]);
        return (
          <td key={k} className={`p-4 text-center border border-slate-700 bg-slate-800 text-sm font-bold ${color}`}>
            {isP ? `${(val * 100).toFixed(1)}%` : isR ? val.toFixed(2) : val}
          </td>
        );
      })}
    </tr>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-100 uppercase">Performance <span className="text-blue-500">Matrix</span></h1>
        <div className="bg-slate-800 border border-slate-700 p-1 rounded-xl flex gap-1">
          {['Monthly', 'Quarterly', 'Yearly'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === t ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 bg-slate-900 border border-slate-700 text-[10px] font-black text-slate-500 uppercase tracking-widest">Metrics (R Based)</th>
              {keys.map(k => <th key={k} className="p-4 text-center bg-slate-900 border border-slate-700 text-xs font-black text-slate-300">{k}</th>)}
            </tr>
          </thead>
          <tbody>
            <Row label="Trades Closed" func={(m) => m.total} />
            <Row label="Winners" func={(m) => m.winners} color="text-emerald-400" />
            <Row label="Losers" func={(m) => m.losers} color="text-rose-400" />
            <Row label="Win Rate" func={(m) => m.winRate} isP color="text-blue-400" />
            <Row label="Avg Gain (Winners)" func={(m) => m.avgRGain} isR color="text-emerald-400" />
            <Row label="Avg Loss (Losers)" func={(m) => m.avgRLoss} isR color="text-rose-400" />
            <Row label="ARR" func={(m) => m.arr} isR color="text-indigo-400" />
            <Row label="Expectancy (R)" func={(m) => m.expectancy} isR color="text-blue-400" />
            <Row label="Total R Gained" func={(m) => m.totalR} isR color="text-emerald-500" />
          </tbody>
        </table>
      </div>
    </div>
  );
}