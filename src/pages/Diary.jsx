// Diary.jsx
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import MistakeForm from '../components/MistakeForm';

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

  const handleAddMistake = (newMistake) => {
    setMistakes([newMistake, ...mistakes]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-[#494D5F] w-full max-w-full">
      <div className="w-full max-w-full">
        <h1 className="text-2xl font-bold text-[#8458B3] break-words">
          TRADING <span className="text-[#a28089]">DIARY</span>
        </h1>
        <p className="text-sm font-medium text-[#a28089] break-words">
          Track your mistakes and improve monthly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-full">
        <div className="bg-white border border-[#d0bdf4] p-5 rounded-2xl shadow-sm w-full max-w-full">
          <p className="text-xs font-semibold text-[#a28089] uppercase break-words">Total Mistakes</p>
          <h2 className="text-3xl font-bold text-[#8458B3] mt-1 break-words">{total}</h2>
        </div>

        <div className="bg-white border border-[#d0bdf4] p-5 rounded-2xl shadow-sm w-full max-w-full">
          <p className="text-xs font-semibold text-[#a28089] uppercase break-words">Serious Mistakes</p>
          <h2 className="text-3xl font-bold text-rose-500 mt-1 break-words">{highSev}</h2>
        </div>

        <div className="bg-white border border-[#d0bdf4] p-5 rounded-2xl shadow-sm w-full max-w-full">
          <p className="text-xs font-semibold text-[#a28089] uppercase break-words">Most Repeated</p>
          <h2 className="text-xl font-semibold text-[#494D5F] mt-2 break-words">{mostFrequent}</h2>
        </div>
      </div>

      <div className="bg-white border border-[#d0bdf4] rounded-2xl shadow-sm overflow-hidden w-full max-w-full">
        <div className="p-4 border-b border-[#e5eaf5] flex justify-between items-center w-full max-w-full">
          <h3 className="font-semibold text-[#8458B3] break-words">Mistake Logs</h3>
          <MistakeForm onAdd={handleAddMistake} />
        </div>

        <div className="overflow-x-auto w-full max-w-full bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8f9fc]">
              <tr className="text-[10px] font-bold uppercase tracking-widest text-[#a28089]">
                <th className="px-3 py-2.5 border border-[#e5eaf5] text-center whitespace-nowrap">No.</th>
                <th className="px-3 py-2.5 border border-[#e5eaf5] text-left whitespace-nowrap">Date</th>
                <th className="px-3 py-2.5 border border-[#e5eaf5] text-left whitespace-nowrap">Mistake</th>
                <th className="px-3 py-2.5 border border-[#e5eaf5] text-left whitespace-nowrap">Details</th>
                <th className="px-3 py-2.5 border border-[#e5eaf5] text-center whitespace-nowrap">Setup</th>
                <th className="px-3 py-2.5 border border-[#e5eaf5] text-center whitespace-nowrap">Severity</th>
              </tr>
            </thead>

            <tbody className="text-sm font-medium">
              {mistakes.map((m, i) => (
                <tr key={m.id} className="hover:bg-[#f8f9fc] transition-colors">
                  <td className="px-3 py-2 border border-[#e5eaf5] text-center whitespace-nowrap">{i + 1}</td>

                  <td className="px-3 py-2 border border-[#e5eaf5] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#a0d2eb]"/> {m.date}
                    </div>
                  </td>

                  <td className="px-3 py-2 border border-[#e5eaf5] text-[#8458B3] whitespace-nowrap">{m.type}</td>

                  <td className="px-3 py-2 border border-[#e5eaf5] text-[#a28089] truncate max-w-[250px]">
                    {m.desc}
                  </td>

                  <td className="px-3 py-2 border border-[#e5eaf5] text-center whitespace-nowrap">
                    <span className="bg-[#e5eaf5] text-[#8458B3] px-2 py-1 rounded text-xs">
                      {m.tag}
                    </span>
                  </td>

                  <td className="px-3 py-2 border border-[#e5eaf5] text-center whitespace-nowrap">
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