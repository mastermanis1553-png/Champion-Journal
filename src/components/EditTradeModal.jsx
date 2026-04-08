import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { X, ShieldCheck } from 'lucide-react';

export default function EditTradeModal({ trade, onClose }) {
  const { updateTrade } = useTrades();
  const [cmp, setCmp] = useState(trade.cmp || trade.entry);
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
    <div className="fixed inset-0 bg-[#333]/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 w-full max-w-sm shadow-2xl border-2 border-[#d0bdf4] relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#a28089] hover:text-[#8458B3] transition-colors"><X size={24}/></button>
        
        <h2 className="text-2xl font-black text-[#8458B3] mb-1 uppercase">Modify <span className="text-[#a0d2eb]">Position</span></h2>
        <p className="text-xs font-bold text-[#a28089] uppercase tracking-widest mb-6">{trade.symbol} @ ₹{trade.entry}</p>

        <div className="space-y-5">
          <div className="flex flex-col">
            <label className="text-xs font-black text-[#a28089] uppercase mb-2 tracking-widest">Current Market Price (CMP)</label>
            <input type="number" step="any" className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none text-[#333] font-bold transition-all" value={cmp} onChange={(e) => setCmp(e.target.value)} />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black text-[#a28089] uppercase mb-2 tracking-widest">Stop Loss</label>
            <div className="flex gap-3">
              <input type="number" step="any" className="flex-1 bg-white border-2 border-[#d0bdf4] p-3 rounded-xl focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none text-[#333] font-bold transition-all" value={sl} onChange={(e) => setSl(e.target.value)} />
              <button onClick={() => setSl(trade.entry)} title="Make Risk Free" className="bg-emerald-100 text-emerald-700 px-4 rounded-xl border-2 border-emerald-300 hover:bg-emerald-200 transition-all font-black flex items-center gap-1">
                <ShieldCheck size={16}/> RF
              </button>
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-[#8458B3] text-white font-black py-4 rounded-xl shadow-lg hover:bg-[#a0d2eb] hover:text-[#8458B3] transition-all duration-200 mt-6 uppercase tracking-widest text-xs">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}