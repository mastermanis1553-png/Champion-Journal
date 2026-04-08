import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { X, ShieldCheck } from 'lucide-react';

export default function EditTradeModal({ trade, onClose }) {
  const { updateTrade } = useTrades();
  const[cmp, setCmp] = useState(trade.cmp || trade.entry);
  const [sl, setSl] = useState(trade.sl);

  const handleSave = async () => {
    await updateTrade(trade.id, { 
      cmp: parseFloat(cmp), 
      sl: parseFloat(sl),
      isRiskFree: parseFloat(sl) === trade.entry 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0B1320] rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-slate-700 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white"><X size={20}/></button>
        
        <h2 className="text-xl font-black text-slate-100 mb-1 uppercase">Modify <span className="text-blue-500">Position</span></h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{trade.symbol} @ ₹{trade.entry}</p>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Current Market Price (CMP)</label>
            <input type="number" step="any" className="bg-[#050B14] border border-slate-700 p-3 rounded-xl focus:border-blue-500 outline-none text-slate-200 font-bold" value={cmp} onChange={(e) => setCmp(e.target.value)} />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Stop Loss</label>
            <div className="flex gap-2">
              <input type="number" step="any" className="flex-1 bg-[#050B14] border border-slate-700 p-3 rounded-xl focus:border-blue-500 outline-none text-slate-200 font-bold" value={sl} onChange={(e) => setSl(e.target.value)} />
              <button onClick={() => setSl(trade.entry)} title="Make Risk Free" className="bg-emerald-900/30 text-emerald-400 px-4 rounded-xl border border-emerald-800/50 hover:bg-emerald-900/50 flex items-center gap-2 font-bold text-xs transition">
                <ShieldCheck size={16}/> RF
              </button>
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-blue-500 transition-all mt-4 uppercase tracking-widest text-xs">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}