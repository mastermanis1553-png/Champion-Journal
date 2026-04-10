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
    <div className="fixed inset-0 bg-[#494D5F]/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto w-full max-w-full">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 w-full max-w-sm shadow-2xl border border-[#d0bdf4] relative max-w-full">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 text-[#a28089] hover:text-[#8458B3]"
        >
          <X size={18}/>
        </button>
        
        <h2 className="text-lg sm:text-xl font-bold text-[#8458B3] mb-1 uppercase tracking-tight break-words">
          Modify Position
        </h2>

        <p className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase tracking-widest mb-4 sm:mb-6 break-words">
          {trade.type || 'LONG'} | {trade.symbol} @ ₹{trade.entry}
        </p>

        <div className="space-y-3 sm:space-y-4 w-full max-w-full">

          <div className="flex flex-col w-full">
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase mb-1">
              Current Market Price (CMP)
            </label>
            <input 
              type="number" 
              step="any" 
              className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl focus:border-[#a0d2eb] outline-none text-[#494D5F] font-bold text-sm max-w-full" 
              value={cmp} 
              onChange={(e) => setCmp(e.target.value)} 
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase mb-1">
              Stop Loss
            </label>

            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-full">
              <input 
                type="number" 
                step="any" 
                className="w-full sm:flex-1 bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl focus:border-[#a0d2eb] outline-none text-[#494D5F] font-bold text-sm max-w-full" 
                value={sl} 
                onChange={(e) => setSl(e.target.value)} 
              />

              <button 
                onClick={() => setSl(trade.entry)} 
                title="Make Risk Free" 
                className="w-full sm:w-auto bg-[#e5eaf5] text-[#8458B3] px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-[#d0bdf4] hover:bg-[#d0bdf4] flex items-center justify-center gap-2 font-bold text-xs transition max-w-full"
              >
                <ShieldCheck size={14}/> RF
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave} 
            className="w-full bg-[#8458B3] text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-md hover:opacity-90 transition-opacity mt-3 sm:mt-4 uppercase tracking-widest text-xs sm:text-sm max-w-full"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}