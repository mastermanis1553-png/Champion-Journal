import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { X, ShieldCheck } from 'lucide-react';

export default function EditTradeModal({ trade, onClose }) {
  const { updateTrade } = useTrades();

  const formatDate = (d) => {
    if (!d) return '';
    if (typeof d === 'string') return d.split('T')[0];
    if (d.seconds) return new Date(d.seconds * 1000).toISOString().split('T')[0];
    return '';
  };

  const [date, setDate] = useState(formatDate(trade.date));
  const [exitDate, setExitDate] = useState(formatDate(trade.exitDate));
  const [qty, setQty] = useState(trade.qty || '');
  const [entry, setEntry] = useState(trade.entry || '');
  const [cmp, setCmp] = useState(trade.cmp || trade.entry);
  const [sl, setSl] = useState(trade.sl);
  const [bookedQty, setBookedQty] = useState(trade.bookedQty || 0);

  const handleSave = async () => {
    const booked = parseFloat(bookedQty) || 0;
    const totalQty = parseFloat(qty) || 0;

    if (booked > totalQty) {
      alert('Booked quantity cannot exceed total quantity');
      return;
    }

    const remainingQty = totalQty - booked;

    await updateTrade(trade.id, { 
      date: date ? new Date(date).toISOString() : trade.date,
      exitDate: exitDate ? new Date(exitDate).toISOString() : trade.exitDate,
      qty: totalQty,
      entry: parseFloat(entry),
      cmp: parseFloat(cmp), 
      sl: booked > 0 ? parseFloat(entry) : parseFloat(sl),
      bookedQty: booked,
      remainingQty: remainingQty,
      isRiskFree: booked > 0 ? true : parseFloat(sl) === parseFloat(entry)
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
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase mb-1">Entry Date</label>
            <input type="date" className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase mb-1">Exit Date</label>
            <input type="date" className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl" value={exitDate} onChange={(e) => setExitDate(e.target.value)} />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase mb-1">Quantity</label>
            <input type="number" className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl" value={qty} onChange={(e) => setQty(e.target.value)} />
          </div>

          {/* NEW FIELD */}
          <div className="flex flex-col w-full">
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase mb-1">Booked Quantity</label>
            <input 
              type="number"
              className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl"
              value={bookedQty}
              onChange={(e) => setBookedQty(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase mb-1">Entry Price</label>
            <input type="number" step="any" className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl" value={entry} onChange={(e) => setEntry(e.target.value)} />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase mb-1">Current Market Price (CMP)</label>
            <input type="number" step="any" className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl" value={cmp} onChange={(e) => setCmp(e.target.value)} />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase mb-1">Stop Loss</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="number" step="any" className="w-full sm:flex-1 bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl" value={sl} onChange={(e) => setSl(e.target.value)} />
              <button onClick={() => setSl(entry)} className="w-full sm:w-auto bg-[#e5eaf5] text-[#8458B3] px-3 py-2 rounded-lg border border-[#d0bdf4] flex items-center justify-center gap-2 font-bold text-xs">
                <ShieldCheck size={14}/> RF
              </button>
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-[#8458B3] text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}