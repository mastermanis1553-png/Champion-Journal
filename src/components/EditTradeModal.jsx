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
    <div className="fixed inset-0 bg-[#494D5F]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-[#d0bdf4] relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#a28089] hover:text-[#8458B3]"><X size={20}/></button>
        
        <h2 className="text-xl font-bold text-[#8458B3] mb-1 uppercase tracking-tight">Modify Position</h2>
        <p className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest mb-6">
          {trade.type || 'LONG'} | {trade.symbol} @ ₹{trade.entry}
        </p>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-semibold text-[#a28089] uppercase mb-1">Current Market Price (CMP)</label>
            <input type="number" step="any" className="bg-[#f8f9fc] border border-[#e5eaf5] p-3 rounded-xl focus:border-[#a0d2eb] outline-none text-[#494D5F] font-bold" value={cmp} onChange={(e) => setCmp(e.target.value)} />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-semibold text-[#a28089] uppercase mb-1">Stop Loss</label>
            <div className="flex gap-2">
              <input type="number" step="any" className="flex-1 bg-[#f8f9fc] border border-[#e5eaf5] p-3 rounded-xl focus:border-[#a0d2eb] outline-none text-[#494D5F] font-bold" value={sl} onChange={(e) => setSl(e.target.value)} />
              <button onClick={() => setSl(trade.entry)} title="Make Risk Free" className="bg-[#e5eaf5] text-[#8458B3] px-4 rounded-xl border border-[#d0bdf4] hover:bg-[#d0bdf4] flex items-center gap-2 font-bold text-xs transition">
                <ShieldCheck size={16}/> RF
              </button>
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-[#8458B3] text-white font-bold py-4 rounded-xl shadow-md hover:opacity-90 transition-opacity mt-4 uppercase tracking-widest text-xs">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}