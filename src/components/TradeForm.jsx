import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTrades } from '../context/TradeContext';
import { Timestamp } from 'firebase/firestore';
import { X } from 'lucide-react';

export default function TradeForm() {
  const { addTrade, settings } = useTrades();
  const [isOpen, setIsOpen] = useState(false);
  const[form, setForm] = useState({ date: '', symbol: '', entry: '', sl: '', target: '', quantity: '' });

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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#0B1320] border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-xl font-black text-slate-100 mb-6 uppercase">New <span className="text-blue-500">Position</span></h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Date</label>
              <input type="date" required className="bg-[#050B14] border border-slate-700 p-3 rounded-xl text-slate-200 text-sm focus:border-blue-500 outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Symbol</label>
              <input type="text" required className="bg-[#050B14] border border-slate-700 p-3 rounded-xl text-slate-200 text-sm uppercase focus:border-blue-500 outline-none" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Entry Price</label>
              <input type="number" step="any" required className="bg-[#050B14] border border-slate-700 p-3 rounded-xl text-slate-200 text-sm focus:border-blue-500 outline-none" value={form.entry} onChange={e => setForm({...form, entry: e.target.value})} />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Stop Loss</label>
              <input type="number" step="any" required className="bg-[#050B14] border border-slate-700 p-3 rounded-xl text-slate-200 text-sm focus:border-blue-500 outline-none" value={form.sl} onChange={e => setForm({...form, sl: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Price</label>
              <input type="number" step="any" required className="bg-[#050B14] border border-slate-700 p-3 rounded-xl text-slate-200 text-sm focus:border-blue-500 outline-none" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] font-bold text-blue-400 uppercase">Quantity</label>
                {idealQty > 0 && (
                  <button type="button" onClick={applyIdealQty} className="text-[9px] font-bold bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded hover:bg-blue-600 hover:text-white transition-colors">
                    Use: {idealQty}
                  </button>
                )}
              </div>
              <input type="number" step="any" required className="bg-blue-900/10 border border-blue-500/30 p-3 rounded-xl text-blue-400 font-bold text-sm focus:border-blue-500 outline-none" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl mt-4 transition-colors uppercase text-sm tracking-widest shadow-lg shadow-blue-900/20">
            Execute Order
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all">
        + Execute Trade
      </button>
      {isOpen && createPortal(modal, document.body)}
    </>
  );
}