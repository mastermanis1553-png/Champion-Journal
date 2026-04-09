import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { groupTrades, calculateMetrics } from '../utils/math';

export default function Summary() {
  const { trades, settings } = useTrades();
  const [tab, setTab] = useState('Quarterly');
  const groups = groupTrades(trades, tab);
  const keys = Object.keys(groups).sort().reverse();

  const Row = ({ label, func, color = "text-[#494D5F]", isR = false, isP = false, isMoney = false, bg = "bg-white" }) => (
    <tr>
      <td className={`p-4 font-semibold text-[#a28089] border border-[#e5eaf5] text-xs uppercase tracking-wider ${bg}`}>{label}</td>
      {keys.map(k => {
        const m = calculateMetrics(groups[k], settings?.rValue || 1250);
        const val = func(m, groups[k]) || 0;
        return (
          <td key={k} className={`p-4 text-center border border-[#e5eaf5] text-sm font-bold ${bg} ${color}`}>
            {isP ? `${(val * 100).toFixed(1)}%` : 
             isMoney ? `₹${Math.floor(val).toLocaleString()}` : 
             isR ? val.toFixed(2) : val}
          </td>
        );
      })}
    </tr>
  );

  const Spacer = () => <tr><td colSpan={keys.length + 1} className="h-4 bg-[#e5eaf5]"></td></tr>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#8458B3] uppercase tracking-tight">Performance <span className="text-[#a28089]">Matrix</span></h1>
        <div className="bg-white border border-[#d0bdf4] p-1 rounded-xl flex gap-1 shadow-sm">
          {['Monthly', 'Quarterly', 'Yearly'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-[#8458B3] text-white shadow-sm' : 'text-[#a28089] hover:text-[#8458B3]'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#d0bdf4] shadow-sm bg-white">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr>
              <th className="p-4 bg-[#f8f9fc] border border-[#e5eaf5] text-xs font-bold text-[#8458B3] uppercase tracking-widest">Metrics View (R Based)</th>
              {keys.map(k => <th key={k} className="p-4 text-center bg-[#f8f9fc] border border-[#e5eaf5] text-sm font-bold text-[#494D5F]">{k}</th>)}
            </tr>
          </thead>
          <tbody>
            <Row label="Trades Entered" func={(m, g) => g.length} />
            <Row label="Open Till Date" func={(m) => `[${m.open}]`} color="text-orange-500" />
            <Spacer />
            <Row label="Trades Closed" func={(m) => m.total} />
            <Row label="Winners" func={(m) => m.winners} color="text-emerald-500" />
            <Row label="Losers" func={(m) => m.losers} color="text-rose-500" />
            <Row label="Win Rate" func={(m) => m.winRate} isP color="text-[#a0d2eb]" />
            <Spacer />
            <Row label="Avg R Gain (Winners)" func={(m) => m.avgRGain} isR color="text-emerald-500" bg="bg-[#f8f9fc]" />
            <Row label="Avg R Loss (Losers)" func={(m) => m.avgRLoss} isR color="text-rose-500" bg="bg-[#f8f9fc]" />
            <Row label="ARR" func={(m) => m.arr} isR color="text-[#8458B3]" bg="bg-[#f8f9fc]" />
            <Spacer />
            <Row label="Trade Expectancy (R)" func={(m) => m.expectancy} isR color="text-emerald-500" />
            <Row label="Total R Gained" func={(m) => m.totalR} isR color="text-[#8458B3]" />
            <Spacer />
            <Row label="Total Profit (Closed Trades)" func={(m) => m.totalNetPnl} isMoney color="text-emerald-500" />
          </tbody>
        </table>
      </div>
    </div>
  );
}