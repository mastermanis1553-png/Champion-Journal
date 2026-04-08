import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTrades } from '../context/TradeContext';
import { Timestamp } from 'firebase/firestore';
import { X } from 'lucide-react';

export default function TradeForm() {
  const { addTrade, settings } = useTrades();
  const [isOpen, setIsOpen] = useState(false);
  
  // Naya state: quantity bhi ab user bhar sakta hai
  const [form, setForm] = useState({ date: '', symbol: '', entry: '', sl: '', target: '', quantity: '' });

  const currentR = parseFloat(settings?.rValue) || 1250;
  const entry = parseFloat(form.entry) || 0;
  const sl = parseFloat(form.sl) || 0;
  const target = parseFloat(form.target) || 0;
  const customQty = parseFloat(form.quantity) || 0;
  
  // Mathematical Ideal Qty = R / SL Distance
  const slDist = Math.abs(entry - sl);
  const idealQty = slDist > 0 ? Math.floor(currentR / slDist) : 0;
  const rr = slDist > 0 ? (Math.abs(target - entry) / slDist).toFixed(2) : 0;

  // Auto-fill button action
  const applyIdealQty = () => setForm({ ...form, quantity: idealQty });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (customQty <= 0) return alert("Please enter a valid Custom Quantity!");
    if (slDist <= 0) return alert("Entry and SL cannot be the same!");
    
    await addTrade({
      date: Timestamp.fromDate(new Date(form.date || new Date())),
      symbol: form.symbol.toUpperCase(),
      entry, sl, target, 
      quantity: customQty, // Ab Custom Qty save hogi
      initialSl: sl, 
      riskAmount: currentR, 
      status: 'Open', 
      rMultiple: 0, 
      cmp: entry,
      exitDate: null
    });
    
    setIsOpen(false);
    setForm({ date: '', symbol: '', entry: '', sl: '', target: '', quantity: '' });
  };

  const modalContent = isOpen && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white border border-slate-200 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">
          New <span className="text-blue-600">Position</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 font-bold">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Trade Date</label>
              <input type="date" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Symbol</label>
              <input type="text" placeholder="e.g. RELIANCE" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm uppercase outline-none focus:border-blue-500" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Entry Price</label>
              <input type="number" step="any" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500" value={form.entry} onChange={e => setForm({...form, entry: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Stop Loss</label>
              <input type="number" step="any" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500" value={form.sl} onChange={e => setForm({...form, sl: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Target Price</label>
              <input type="number" step="any" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
            </div>
            
            {/* --- CUSTOM QUANTITY FIELD --- */}
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <label className="text-[10px] uppercase tracking-widest text-blue-600 ml-1">Custom Qty</label>
                {idealQty > 0 && (
                  <button type="button" onClick={applyIdealQty} className="text-[9px] text-white bg-blue-500 px-2 py-0.5 rounded uppercase hover:bg-blue-600">
                    Use: {idealQty}
                  </button>
                )}
              </div>
              <input type="number" step="any" placeholder="Enter Qty" required className="w-full bg-blue-50 border border-blue-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500 text-blue-800 font-black placeholder:text-blue-300" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex justify-between">
            <div className="text-center">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest">Actual Risk</p>
              {/* Shows Red if user takes risk higher than 1R */}
              <p className={`text-lg font-black ${customQty * slDist > currentR ? 'text-red-500' : 'text-slate-800'}`}>₹{Math.floor(customQty * slDist)}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest">Est. RR</p>
              <p className="text-lg font-black text-blue-600">{rr}x</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest">Base (1R)</p>
              <p className="text-lg font-black text-slate-800">₹{currentR}</p>
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl active:scale-95 transition-all mt-2">
            Execute Order
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-all active:scale-95">
        + Execute Trade
      </button>
      {isOpen && createPortal(modalContent, document.body)}
    </>
  );
}