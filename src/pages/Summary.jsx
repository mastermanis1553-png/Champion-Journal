import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { groupTrades, calculateMetrics } from '../utils/math';

export default function Summary() {
  const { trades, settings } = useTrades();
  const [tab, setTab] = useState('Quarterly');
  const groups = groupTrades(trades, tab);
  const keys = Object.keys(groups).sort().reverse();

  const Row = ({ label, func, color = "text-[#333]", isR = false, isP = false, isMoney = false, bg = "bg-white/50" }) => (
    <tr>
      <td className={`p-4 font-black text-[#8458B3] border border-[#d0bdf4] text-xs uppercase tracking-wider ${bg}`}>{label}</td>
      {keys.map(k => {
        const m = calculateMetrics(groups[k], settings?.rValue || 1250);
        const val = func(m, groups[k]) || 0;
        return (
          <td key={k} className={`p-4 text-center border border-[#d0bdf4] text-sm font-black ${bg} ${color}`}>
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-[#8458B3] uppercase">Performance <span className="text-[#a0d2eb]">Matrix</span></h1>
        <div className="bg-white/70 border-2 border-[#d0bdf4] p-1 rounded-xl flex gap-1">
          {['Monthly', 'Quarterly', 'Yearly'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-lg text-sm font-black transition-all ${tab === t ? 'bg-[#8458B3] text-white shadow-md' : 'text-[#a28089] hover:text-[#8458B3]'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border-2 border-[#d0bdf4] shadow-lg bg-white/70 backdrop-blur-md">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr>
              <th className="p-4 bg-[#f8fafc] border border-[#d0bdf4] text-xs font-black text-[#8458B3] uppercase tracking-widest">Metrics View (R Based)</th>
              {keys.map(k => <th key={k} className="p-4 text-center bg-[#f8fafc] border border-[#d0bdf4] text-sm font-black text-[#8458B3]">{k}</th>)}
            </tr>
          </thead>
          <tbody>
            <Row label="Trades Entered" func={(m, g) => g.length} />
            <Row label="Open Till Date" func={(m) => `[${m.open}]`} color="text-[#a28089]" />
            <Spacer />
            <Row label="Trades Closed" func={(m) => m.total} />
            <Row label="Breakeven" func={(m) => `[${m.be}]`} color="text-[#8458B3]" />
            <Row label="Winners + Losers" func={(m) => m.winners + m.losers} />
            <Row label="Winners" func={(m) => m.winners} color="text-emerald-600" />
            <Row label="Losers" func={(m) => m.losers} color="text-rose-600" />
            <Row label="Win Rate" func={(m) => m.winRate} isP color="text-[#333]" />
            <Spacer />
            <Row label="Avg Loss (Losers)" func={(m) => m.avgLossMoney} isMoney color="text-rose-600" bg="bg-[#a0d2eb]/10" />
            <Row label="Avg Gain (Winners)" func={(m) => m.avgGainMoney} isMoney color="text-emerald-600" bg="bg-[#a0d2eb]/10" />
            <Row label="Avg Loss (BE)" func={(m) => m.avgBeMoney} isMoney color="text-[#8458B3]" bg="bg-[#a0d2eb]/10" />
            <Spacer />
            <Row label="Avg R Loss (Losers)" func={(m) => m.avgRLoss} isR color="text-rose-600" />
            <Row label="Avg R Gain (Winners)" func={(m) => m.avgRGain} isR color="text-emerald-600" />
            <Row label="ARR" func={(m) => m.arr} isR color="text-[#333]" />
            <Row label="Avg R Loss (BE)" func={(m) => m.avgRBe} isR color="text-[#8458B3]" />
            <Spacer />
            <Row label="Trade Expectancy (in R)" func={(m) => m.expectancy} isR color="text-emerald-600" />
            <Row label="Trades Closed" func={(m) => m.total} />
            <Row label="Total R Gained" func={(m) => m.totalR} isR color="text-emerald-600" />
            <Spacer />
            <Row label="Avg Risk (R)" func={() => settings?.rValue || 1250} isMoney color="text-[#333]" />
            <Row label="Total Profit (By Close Date)" func={(m) => m.totalProfit} isMoney color="text-emerald-600" />
          </tbody>
        </table>
      </div>
    </div>
  );
}