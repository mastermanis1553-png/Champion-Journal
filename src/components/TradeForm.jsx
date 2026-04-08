import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTrades } from '../context/TradeContext';
import { Timestamp } from 'firebase/firestore';
import { X, Plus } from 'lucide-react';

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
    <div className="fixed inset-0 bg-[#333]/25 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white/75 backdrop-blur-2xl border-2 border-[#d0bdf4] p-8 rounded-3xl w-full max-w-md shadow-2xl relative" style={{ fontFamily: 'Inter, sans-serif' }}>
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-[#a28089] hover:text-[#8458B3] transition-colors hover:bg-white/40 p-1 rounded-lg"><X size={24} /></button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-black text-[#8458B3] uppercase tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            New <span className="text-[#a0d2eb]">Position</span>
          </h2>
          <p className="text-xs font-semibold text-[#a28089] tracking-widest mt-2">Execute a new trading position</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-black text-[#8458B3] uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Date</label>
              <input type="date" required className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl text-[#1a1a2e] text-sm font-medium focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none transition-all" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-black text-[#8458B3] uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Symbol</label>
              <input type="text" required className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl text-[#1a1a2e] text-sm font-medium uppercase focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none transition-all" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} placeholder="STOCK" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-black text-[#8458B3] uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Entry Price</label>
              <input type="number" step="any" required className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl text-[#1a1a2e] text-sm font-medium focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none transition-all" value={form.entry} onChange={e => setForm({...form, entry: e.target.value})} placeholder="0.00" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-black text-[#8458B3] uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Stop Loss</label>
              <input type="number" step="any" required className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl text-[#1a1a2e] text-sm font-medium focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none transition-all" value={form.sl} onChange={e => setForm({...form, sl: e.target.value})} placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-black text-[#8458B3] uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Target Price</label>
              <input type="number" step="any" required className="bg-white border-2 border-[#d0bdf4] p-3 rounded-xl text-[#1a1a2e] text-sm font-medium focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 outline-none transition-all" value={form.target} onChange={e => setForm({...form, target: e.target.value})} placeholder="0.00" />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-black text-[#8458B3] uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Quantity</label>
                {idealQty > 0 && (
                  <button type="button" onClick={applyIdealQty} className="text-xs font-black bg-[#a0d2eb]/50 text-[#8458B3] px-2.5 py-1 rounded-lg hover:bg-[#a0d2eb] transition-all tracking-wider">
                    Use: {idealQty}
                  </button>
                )}
              </div>
              <input type="number" step="any" required className="bg-[#a0d2eb]/20 border-2 border-[#a0d2eb] p-3 rounded-xl text-[#8458B3] font-bold text-sm focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 focus:bg-white outline-none transition-all" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="0" />
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-[#8458B3] to-[#a0d2eb] hover:from-[#a0d2eb] hover:to-[#8458B3] text-white font-black py-4 rounded-xl mt-6 transition-all duration-200 uppercase text-sm tracking-widest shadow-lg hover:shadow-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Execute Order
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="bg-gradient-to-r from-[#8458B3] to-[#a0d2eb] hover:from-[#a0d2eb] hover:to-[#8458B3] text-white px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        <Plus size={16} /> TRADE
      </button>
      {isOpen && createPortal(modal, document.body)}
    </>
  );
}