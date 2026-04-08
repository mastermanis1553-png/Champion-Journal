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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={20}/></button>
        
        <h2 className="text-lg font-black text-slate-800 mb-1">EDIT POSITION</h2>
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-6">{trade.symbol} @ ₹{trade.entry}</p>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase">Current Market Price (CMP)</label>
            <input type="number" step="any" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={cmp} onChange={(e) => setCmp(e.target.value)} />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase">Stop Loss</label>
            <div className="flex gap-2">
              <input type="number" step="any" className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={sl} onChange={(e) => setSl(e.target.value)} />
              <button onClick={() => setSl(trade.entry)} title="Make Risk Free (SL = Entry)" className="bg-green-50 text-green-600 px-4 rounded-lg border border-green-200 hover:bg-green-100 flex items-center gap-2 font-bold text-xs transition">
                <ShieldCheck size={16}/> RF
              </button>
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-blue-600 text-white font-black py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all active:scale-95 mt-2">
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
}