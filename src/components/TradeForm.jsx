import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTrades } from '../context/TradeContext';
import { Timestamp } from 'firebase/firestore';
import { X } from 'lucide-react';

export default function TradeForm() {
  const { addTrade, settings } = useTrades();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ date: '', symbol: '', entry: '', sl: '', target: '', quantity: '' });

  const currentR = parseFloat(settings?.rValue) || 1250;
  const entry = parseFloat(form.entry) || 0;
  const sl = parseFloat(form.sl) || 0;
  const target = parseFloat(form.target) || 0;
  const customQty = parseFloat(form.quantity) || 0;
  
  const slDist = Math.abs(entry - sl);
  const idealQty = slDist > 0 ? Math.floor(currentR / slDist) : 0;
  const rr = slDist > 0 ? (Math.abs(target - entry) / slDist).toFixed(2) : 0;

  const applyIdealQty = () => setForm({ ...form, quantity: idealQty });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (customQty <= 0) return alert("Invalid Quantity!");
    
    await addTrade({
      date: Timestamp.fromDate(new Date(form.date || new Date())),
      symbol: form.symbol.toUpperCase(),
      entry, sl, target, quantity: customQty,
      initialSl: sl, riskAmount: currentR, 
      status: 'Open', rMultiple: 0, cmp: entry, exitDate: null
    });
    setIsOpen(false);
    setForm({ date: '', symbol: '', entry: '', sl: '', target: '', quantity: '' });
  };

  const modal = isOpen && (
    <div className="fixed inset-0 bg-[#333]/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-[#a28089] hover:text-[#8458B3] transition-colors"><X size={24} /></button>
        <h2 className="text-2xl font-black text-[#8458B3] mb-6 uppercase">New <span className="text-[#a0d2eb]">Position</span></h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-black text-[#a28089] uppercase mb-2 tracking-widest">Date</label>
              <input type="date" required className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl text-[#333] text-sm focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none transition-all" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-black text-[#a28089] uppercase mb-2 tracking-widest">Symbol</label>
              <input type="text" required className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl text-[#333] text-sm uppercase focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none transition-all" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-black text-[#a28089] uppercase mb-2 tracking-widest">Entry Price</label>
              <input type="number" step="any" required className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl text-[#333] text-sm focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none transition-all" value={form.entry} onChange={e => setForm({...form, entry: e.target.value})} />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-black text-[#a28089] uppercase mb-2 tracking-widest">Stop Loss</label>
              <input type="number" step="any" required className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl text-[#333] text-sm focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none transition-all" value={form.sl} onChange={e => setForm({...form, sl: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-black text-[#a28089] uppercase mb-2 tracking-widest">Target Price</label>
              <input type="number" step="any" required className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl text-[#333] text-sm focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none transition-all" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-black text-[#8458B3] uppercase tracking-widest">Quantity</label>
                {idealQty > 0 && (
                  <button type="button" onClick={applyIdealQty} className="text-xs font-black bg-[#a0d2eb]/50 text-[#8458B3] px-2 py-1 rounded-lg hover:bg-[#a0d2eb] transition-all">
                    Use: {idealQty}
                  </button>
                )}
              </div>
              <input type="number" step="any" required className="bg-[#a0d2eb]/20 border-2 border-[#a0d2eb] p-3 rounded-xl text-[#8458B3] font-bold text-sm focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 focus:bg-white outline-none transition-all" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#8458B3] hover:bg-[#a0d2eb] hover:text-[#8458B3] text-white font-black py-4 rounded-xl mt-4 transition-all duration-200 uppercase text-sm tracking-wider shadow-lg hover:shadow-xl">
            Execute Order
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-[#8458B3] hover:bg-[#a0d2eb] hover:text-[#8458B3] text-white px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-md">
        + Execute Trade
      </button>
      {isOpen && createPortal(modal, document.body)}
    </>
  );
}