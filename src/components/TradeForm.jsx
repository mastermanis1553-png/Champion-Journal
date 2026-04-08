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
  };

  const modal = isOpen && (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-200"><X size={20} /></button>
        <h2 className="text-xl font-black text-slate-100 mb-6 uppercase">New <span className="text-blue-500">Position</span></h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase">Date</label>
              <input type="date" required className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-200 text-sm focus:border-blue-500 outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase">Symbol</label>
              <input type="text" required className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-200 text-sm uppercase focus:border-blue-500 outline-none" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase">Entry</label>
              <input type="number" step="any" required className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-200 text-sm focus:border-blue-500 outline-none" value={form.entry} onChange={e => setForm({...form, entry: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase">SL</label>
              <input type="number" step="any" required className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-200 text-sm focus:border-blue-500 outline-none" value={form.sl} onChange={e => setForm({...form, sl: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase">Target</label>
              <input type="number" step="any" required className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-200 text-sm focus:border-blue-500 outline-none" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
            </div>
            <div>
              <div className="flex justify-between items-end">
                <label className="text-[10px] text-blue-400 uppercase">Qty</label>
                {idealQty > 0 && <button type="button" onClick={applyIdealQty} className="text-[9px] text-white bg-blue-600 px-2 rounded mb-1">Use {idealQty}</button>}
              </div>
              <input type="number" step="any" required className="w-full bg-slate-800 border border-blue-500/50 p-3 rounded-xl text-slate-200 text-sm focus:border-blue-500 outline-none" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4 transition-colors uppercase text-sm tracking-widest">
            Execute Order
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all">
        + Execute Trade
      </button>
      {isOpen && createPortal(modal, document.body)}
    </>
  );
}