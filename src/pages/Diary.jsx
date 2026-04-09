import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const INITIAL_MISTAKES =[
  { id: 1, date: '2026-04-09', type: 'FOMO Entry', desc: 'Chased breakout without confirmation.', tag: 'Breakout', severity: 'High' },
  { id: 2, date: '2026-04-08', type: 'Revenge Trade', desc: 'Took trades after a loss.', tag: 'Scalping', severity: 'High' },
  { id: 3, date: '2026-04-05', type: 'Big Position', desc: 'Took extra risk without confidence.', tag: 'Mean Reversion', severity: 'Medium' }
];

export default function Diary() {
  const [mistakes, setMistakes] = useState(INITIAL_MISTAKES);

  const total = mistakes.length;
  const highSev = mistakes.filter(m => m.severity === 'High').length;

  const freqMap = mistakes.reduce((acc, m) => { acc[m.type] = (acc[m.type] || 0) + 1; return acc; }, {});
  const mostFrequent = Object.keys(freqMap).sort((a,b) => freqMap[b] - freqMap[a])[0] || 'None';

  // ✅ Button working
  const handleAddMistake = () => {
    const type = prompt("Mistake Type (e.g. Early Entry, Overtrade):");
    if (!type) return;

    const desc = prompt("What mistake did you make?");
    const tag = prompt("Strategy/Setup (optional):") || '-';
    const severity = prompt("Severity (Low / Medium / High):") || 'Low';

    const newMistake = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type,
      desc,
      tag,
      severity
    };

    setMistakes([newMistake, ...mistakes]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-[#494D5F]">
      <div>
        <h1 className="text-2xl font-bold text-[#8458B3]">TRADING <span className="text-[#a28089]">DIARY</span></h1>
        <p className="text-sm font-medium text-[#a28089]">Track your mistakes and improve monthly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#d0bdf4] p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-semibold text-[#a28089] uppercase">Total Mistakes</p>
          <h2 className="text-3xl font-bold text-[#8458B3] mt-1">{total}</h2>
        </div>
        <div className="bg-white border border-[#d0bdf4] p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-semibold text-[#a28089] uppercase">Serious Mistakes</p>
          <h2 className="text-3xl font-bold text-rose-500 mt-1">{highSev}</h2>
        </div>
        <div className="bg-white border border-[#d0bdf4] p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-semibold text-[#a28089] uppercase">Most Repeated</p>
          <h2 className="text-xl font-semibold text-[#494D5F] mt-2">{mostFrequent}</h2>
        </div>
      </div>

      <div className="bg-white border border-[#d0bdf4] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e5eaf5] flex justify-between items-center">
          <h3 className="font-semibold text-[#8458B3]">Mistake Logs</h3>
          <button 
            onClick={handleAddMistake}
            className="bg-[#8458B3] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            + Log Mistake
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap soft-table">
            <thead>
              <tr className="text-xs uppercase tracking-wide">
                <th className="p-4">No.</th>
                <th className="p-4">Date</th>
                <th className="p-4">Mistake</th>
                <th className="p-4">Details</th>
                <th className="p-4">Setup</th>
                <th className="p-4">Severity</th>
              </tr>
            </thead>

            <tbody className="text-sm font-medium">
              {mistakes.map((m, i) => (
                <tr key={m.id} className="hover:bg-[#f8f9fc] transition">
                  <td className="p-4">{i + 1}</td>

                  <td className="p-4 flex items-center gap-2">
                    <Calendar size={14} className="text-[#a0d2eb]"/> {m.date}
                  </td>

                  <td className="p-4 text-[#8458B3]">{m.type}</td>

                  <td className="p-4 text-[#a28089] whitespace-normal min-w-[250px]">{m.desc}</td>

                  <td className="p-4">
                    <span className="bg-[#e5eaf5] text-[#8458B3] px-2 py-1 rounded text-xs">
                      {m.tag}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      m.severity === 'High' ? 'bg-rose-100 text-rose-600' :
                      m.severity === 'Medium' ? 'bg-orange-100 text-orange-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {m.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}