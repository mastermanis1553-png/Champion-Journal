import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { groupTrades, calculateMetrics } from '../utils/math';

export default function Summary() {
  const { trades, settings } = useTrades();
  const [tab, setTab] = useState('Quarterly');
  const groups = groupTrades(trades, tab);
  const keys = Object.keys(groups).sort().reverse();

  // FIX: Fonts made bigger and brighter (text-slate-200, text-xs, text-sm)
  const Row = ({ label, func, color = "text-slate-200", isR = false, isP = false, isMoney = false, bg = "bg-slate-800/50" }) => (
    <tr>
      <td className={`p-4 font-black text-slate-300 border border-slate-700 text-xs uppercase tracking-wider ${bg}`}>{label}</td>
      {keys.map(k => {
        const m = calculateMetrics(groups[k], settings?.rValue || 1250);
        const val = func(m, groups[k]) || 0;
        return (
          <td key={k} className={`p-4 text-center border border-slate-700 text-sm font-black ${bg} ${color}`}>
            {isP ? `${(val * 100).toFixed(1)}%` : 
             isMoney ? `₹${Math.floor(val).toLocaleString()}` : 
             isR ? val.toFixed(2) : val}
          </td>
        );
      })}
    </tr>
  );

  const Spacer = () => <tr><td colSpan={keys.length + 1} className="h-4 bg-[#050B14]"></td></tr>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-100 uppercase">Performance <span className="text-blue-500">Matrix</span></h1>
        <div className="bg-slate-800 border border-slate-700 p-1 rounded-xl flex gap-1">
          {['Monthly', 'Quarterly', 'Yearly'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === t ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-100'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-xl">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr>
              <th className="p-4 bg-slate-900 border border-slate-700 text-xs font-black text-blue-400 uppercase tracking-widest">Metrics View (R Based)</th>
              {keys.map(k => <th key={k} className="p-4 text-center bg-slate-900 border border-slate-700 text-sm font-black text-slate-100">{k}</th>)}
            </tr>
          </thead>
          <tbody>
            <Row label="Trades Entered" func={(m, g) => g.length} />
            <Row label="Open Till Date" func={(m) => `[${m.open}]`} color="text-slate-400" />
            <Spacer />
            <Row label="Trades Closed" func={(m) => m.total} />
            <Row label="Breakeven" func={(m) => `[${m.be}]`} color="text-blue-400" />
            <Row label="Winners + Losers" func={(m) => m.winners + m.losers} />
            <Row label="Winners" func={(m) => m.winners} color="text-emerald-400" />
            <Row label="Losers" func={(m) => m.losers} color="text-rose-400" />
            <Row label="Win Rate" func={(m) => m.winRate} isP color="text-white" />
            <Spacer />
            <Row label="Avg Loss (Losers)" func={(m) => m.avgLossMoney} isMoney color="text-rose-400" bg="bg-blue-950/20" />
            <Row label="Avg Gain (Winners)" func={(m) => m.avgGainMoney} isMoney color="text-emerald-400" bg="bg-blue-950/20" />
            <Row label="Avg Loss (BE)" func={(m) => m.avgBeMoney} isMoney color="text-blue-400" bg="bg-blue-950/20" />
            <Spacer />
            <Row label="Avg R Loss (Losers)" func={(m) => m.avgRLoss} isR color="text-rose-400" />
            <Row label="Avg R Gain (Winners)" func={(m) => m.avgRGain} isR color="text-emerald-400" />
            <Row label="ARR" func={(m) => m.arr} isR color="text-white" />
            <Row label="Avg R Loss (BE)" func={(m) => m.avgRBe} isR color="text-blue-400" />
            <Spacer />
            <Row label="Trade Expectancy (in R)" func={(m) => m.expectancy} isR color="text-emerald-400" />
            <Row label="Trades Closed" func={(m) => m.total} />
            <Row label="Total R Gained" func={(m) => m.totalR} isR color="text-emerald-500" />
            <Spacer />
            <Row label="Avg Risk (R)" func={() => settings?.rValue || 1250} isMoney color="text-slate-300" />
            <Row label="Total Profit (By Close Date)" func={(m) => m.totalProfit} isMoney color="text-emerald-400" />
          </tbody>
        </table>
      </div>
    </div>
  );
}