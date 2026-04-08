import React, { useState, useEffect } from 'react';
import { useTrades } from '../context/TradeContext';
import { Timestamp } from 'firebase/firestore';
import { X } from 'lucide-react';

export default function TradeForm() {
  const { addTrade, settings } = useTrades();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ date: '', symbol: '', entry: '', sl: '', target: '', quantity: '' });

  const currentR = parseFloat(settings?.rValue) || 1250;

  useEffect(() => {
    const entryVal = parseFloat(form.entry);
    const slVal = parseFloat(form.sl);
    if (entryVal && slVal && Math.abs(entryVal - slVal) > 0) {
      const slDist = Math.abs(entryVal - slVal);
      const suggestedQty = Math.floor(currentR / slDist);
      setForm(prev => ({ ...prev, quantity: suggestedQty }));
    }
  }, [form.entry, form.sl, currentR]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalQty = parseFloat(form.quantity);
    if (!finalQty || finalQty <= 0) return alert("Please enter a valid Quantity!");

    await addTrade({
      date: Timestamp.fromDate(new Date(form.date || new Date())),
      symbol: form.symbol.toUpperCase(),
      entry: parseFloat(form.entry),
      sl: parseFloat(form.sl),
      target: parseFloat(form.target),
      quantity: finalQty,
      initialSl: parseFloat(form.sl),
      riskAmount: currentR,
      status: 'Open',
      rMultiple: 0,
      cmp: parseFloat(form.entry)
    });
    
    setIsOpen(false);
    setForm({ date: '', symbol: '', entry: '', sl: '', target: '', quantity: '' });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 md:px-5 py-2.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-all active:scale-95"
      >
        + Execute Order
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          {/* Ye div popup ko center mein rakhega bina kate */}
          <div className="flex min-h-full items-center justify-center p-4 py-10">
            <div className="relative w-full max-w-md bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200">
              
              <button onClick={() => setIsOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors bg-slate-100 rounded-full p-2">
                <X size={20} />
              </button>
              
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">
                New <span className="text-blue-600">Position</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 font-bold">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Trade Date</label>
                  <input type="date" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Symbol</label>
                  <input type="text" placeholder="e.g. RELIANCE" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm uppercase outline-none focus:border-blue-500 transition-all" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Entry Price</label>
                    <input type="number" step="any" placeholder="0.00" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" value={form.entry} onChange={e => setForm({...form, entry: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Stop Loss</label>
                    <input type="number" step="any" placeholder="0.00" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" value={form.sl} onChange={e => setForm({...form, sl: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Target Price</label>
                  <input type="number" step="any" placeholder="0.00" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
                </div>

                <div className="space-y-1 bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] uppercase tracking-widest text-blue-600 font-black ml-1">Calculated / Custom Qty</label>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Risk: ₹{currentR}</span>
                  </div>
                  <input type="number" step="any" placeholder="Quantity" required className="w-full bg-white border border-blue-200 p-3 rounded-lg text-lg font-black text-blue-600 outline-none focus:border-blue-500 transition-all shadow-sm" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
                  <p className="text-[9px] text-slate-400 italic mt-1 ml-1">*You can override the auto-calculated quantity.</p>
                </div>

                <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl active:scale-95 transition-all mt-4">
                  Execute Order
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}