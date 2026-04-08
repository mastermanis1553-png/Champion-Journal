import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { groupTrades, calculateMetrics } from '../utils/math';

export default function Summary() {
  const { trades, settings } = useTrades();
  const [tab, setTab] = useState('Quarterly');
  const groups = groupTrades(trades, tab);
  const keys = Object.keys(groups).sort().reverse();

  const Spacer = () => <tr><td colSpan={keys.length + 1} className="h-4 bg-[#f3f4f6] border-y border-gray-200"></td></tr>;

  const Row = ({ label, func, c = "text-gray-800", bg = "bg-white", bold = false, prefix = "", isMoney = false }) => (
    <tr className={`${bg} border-b border-gray-200 hover:bg-gray-50`}>
      <td className={`p-2.5 px-4 text-xs font-semibold text-gray-700 sticky left-0 min-w-[200px] border-r border-gray-200 ${bg}`}>{label}</td>
      {keys.map(k => {
        const m = calculateMetrics(groups[k], settings?.rValue || 1250);
        const val = func(m, groups[k]);
        const safeVal = Number(val) || 0; // Saftey net
        
        return (
          <td key={k} className={`p-2.5 text-center text-xs border-r border-gray-200 ${c} ${bold ? 'font-bold' : 'font-medium'}`}>
            {prefix}{isMoney ? safeVal.toLocaleString(undefined, {maximumFractionDigits:0}) : (typeof val === 'string' ? val : safeVal)}
          </td>
        );
      })}
    </tr>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex gap-2">
        {['Monthly', 'Quarterly', 'Yearly'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${tab === t ? 'bg-white shadow-sm border-gray-300 text-gray-800' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-gray-300">
              <th className="p-3 sticky left-0 bg-[#f8f9fa] text-xs font-bold text-gray-600 border-r border-gray-300">Metrics View (R Based)</th>
              {keys.map(k => <th key={k} className="p-3 text-center text-xs font-bold text-gray-800 border-r border-gray-300">{k}</th>)}
            </tr>
          </thead>
          <tbody>
            <Row label="Trades Entered" func={m => m.entered} bg="bg-[#fcfdfd]" />
            <Row label="Open Till Date" func={m => `[${m.openCount}]`} bg="bg-[#fcfdfd]" />
            <Spacer />
            <Row label="Trades Closed" func={m => m.totalClosed} />
            <Row label="Breakeven" func={m => `[${m.be}]`} c="text-[#2563eb]" />
            <Row label="Winners + Losers" func={m => m.winners + m.losers} />
            <Row label="Winners" func={m => m.winners} c="text-[#16a34a]" />
            <Row label="Losers" func={m => m.losers} c="text-[#dc2626]" />
            <Row label="Win Rate" func={m => `${((m.winRate || 0) * 100).toFixed(0)}%`} bold />
            <Spacer />
            
            <Row label="Avg Loss (Losers)" func={m => m.avgLossMoney} isMoney c="text-[#dc2626]" bg="bg-[#e0f2fe]" />
            <Row label="Avg Gain (Winners)" func={m => m.avgGainMoney} isMoney c="text-[#16a34a]" bg="bg-[#e0f2fe]" />
            <Row label="Avg Loss (BE)" func={m => m.avgBEMoney} isMoney c="text-[#2563eb]" bg="bg-[#e0f2fe]" />
            <Spacer />

            <Row label="Avg R Loss (Losers)" func={m => (m.avgRLoss || 0).toFixed(2)} c="text-[#dc2626]" />
            <Row label="Avg R Gain (Winners)" func={m => (m.avgRGain || 0).toFixed(2)} c="text-[#16a34a]" />
            <Row label="ARR" func={m => (m.arr || 0).toFixed(2)} bold />
            <Row label="Avg R Loss (BE)" func={m => (m.avgRBE || 0).toFixed(2)} c="text-[#2563eb]" />
            <Spacer />

            <Row label="Trade Expectancy (in R)" func={m => (m.expectancy || 0).toFixed(2)} c="text-[#16a34a]" bg="bg-[#fcfdfd]" />
            <Row label="Trades Closed" func={m => m.totalClosed} bg="bg-[#fcfdfd]" />
            <Row label="Total R Gained" func={m => (m.totalR || 0).toFixed(2)} c="text-[#16a34a]" bg="bg-[#fcfdfd]" bold />
            <Spacer />

            <Row label="Avg Risk (R)" func={m => m.avgRisk} isMoney bg="bg-[#fcfdfd]" />
            <Row label="Total Profit (By Entry Date)" func={m => m.totalProfit} isMoney c="text-[#dc2626]" bold bg="bg-[#fcfdfd]" />
          </tbody>
        </table>
      </div>
    </div>
  );
}