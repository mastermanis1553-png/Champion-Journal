import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTrades } from '../context/TradeContext';
import { Timestamp } from 'firebase/firestore';
import { X } from 'lucide-react';

export default function TradeForm() {
  const { addTrade, settings } = useTrades();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ date: '', symbol: '', type: 'LONG', entry: '', sl: '', target: '', quantity: '', fees: '0' });

  const currentR = parseFloat(settings?.rValue) || 1250;
  const entry = parseFloat(form.entry) || 0;
  const sl = parseFloat(form.sl) || 0;
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
      type: form.type,
      entry, sl: sl, target: parseFloat(form.target) || 0, 
      quantity: customQty, fees: parseFloat(form.fees) || 0,
      initialSl: sl, riskAmount: currentR, 
      status: 'Open', rMultiple: 0, cmp: entry, exitDate: null
    });

    setIsOpen(false);
    setForm({ date: '', symbol: '', type: 'LONG', entry: '', sl: '', target: '', quantity: '', fees: '0' });
  };

  const modal = isOpen && (
    <div className="fixed inset-0 bg-[#494D5F]/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white border border-[#d0bdf4] p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-[#a28089] hover:text-[#8458B3]"><X size={20} /></button>
        <h2 className="text-xl font-bold text-[#8458B3] mb-6 uppercase tracking-tight">New Position</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-[#494D5F]">

          {/* ✅ DATE FIELD ADDED */}
          <div>
            <label className="text-[10px] font-semibold text-[#a28089] uppercase">Date</label>
            <input 
              type="date"
              className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3 rounded-xl text-sm focus:border-[#a0d2eb] outline-none"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
             <div className="col-span-1">
              <label className="text-[10px] font-semibold text-[#a28089] uppercase">Type</label>
              <select className="w-full bg-[#e5eaf5] border-none p-3 rounded-xl text-sm font-bold text-[#8458B3] outline-none" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-semibold text-[#a28089] uppercase">Symbol</label>
              <input type="text" required className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3 rounded-xl text-sm uppercase focus:border-[#a0d2eb] outline-none" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-[#a28089] uppercase">Entry Price</label>
              <input type="number" step="any" required className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3 rounded-xl text-sm focus:border-[#a0d2eb] outline-none" value={form.entry} onChange={e => setForm({...form, entry: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#a28089] uppercase">Stop Loss</label>
              <input type="number" step="any" required className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3 rounded-xl text-sm focus:border-[#a0d2eb] outline-none" value={form.sl} onChange={e => setForm({...form, sl: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-[#a28089] uppercase">Target Price</label>
              <input type="number" step="any" className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3 rounded-xl text-sm focus:border-[#a0d2eb] outline-none" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] font-semibold text-[#8458B3] uppercase">Qty</label>
                {idealQty > 0 && <button type="button" onClick={applyIdealQty} className="text-[9px] font-bold bg-[#d0bdf4] text-[#8458B3] px-2 py-0.5 rounded">Use: {idealQty}</button>}
              </div>
              <input type="number" step="any" required className="w-full bg-[#e5eaf5] border border-[#d0bdf4] p-3 rounded-xl text-[#8458B3] font-bold text-sm outline-none" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#8458B3] hover:opacity-90 text-white font-bold py-4 rounded-xl mt-4 transition-opacity uppercase text-sm tracking-widest shadow-md">
            Execute Order
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-[#8458B3] hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-widest transition-opacity">
        + New Trade
      </button>
      {isOpen && createPortal(modal, document.body)}
    </>
  );
}