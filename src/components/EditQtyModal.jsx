import React, { useState, useMemo } from 'react';
import { useTrades } from '../context/TradeContext';
import { X } from 'lucide-react';

export default function EditQtyModal({ trade, onClose }) {
  const { updateTrade } = useTrades();

  const [buyingQty, setBuyingQty] = useState(trade.qty || 0);
  const [bookedQty, setBookedQty] = useState(0);
  const [cmp, setCmp] = useState(trade.cmp || trade.entry);

  const entry = Number(trade.entry || 0);

  const remainingQty = useMemo(() => {
    return buyingQty - ((trade.bookedQty || 0) + bookedQty);
  }, [buyingQty, bookedQty, trade.bookedQty]);

  const totalBooked = (trade.bookedQty || 0) + bookedQty;
  const isInvalid = totalBooked > buyingQty;

  const handleSave = async () => {
    if (isInvalid) return;

    await updateTrade(trade.id, {
      qty: Number(buyingQty),
      bookedQty: Number(totalBooked),
      remainingQty: Number(buyingQty - totalBooked),
      cmp: Number(cmp)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#494D5F]/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 w-full max-w-sm shadow-2xl border border-[#d0bdf4] relative">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[#a28089] hover:text-[#8458B3]"
        >
          <X size={18}/>
        </button>
        
        <h2 className="text-lg font-bold text-[#8458B3] mb-1 uppercase tracking-tight">
          Edit Quantity
        </h2>

        <p className="text-xs font-semibold text-[#a28089] uppercase tracking-widest mb-5">
          {trade.type} | {trade.symbol} @ ₹{trade.entry}
        </p>

        <div className="space-y-4">

          <div>
            <label className="text-xs font-semibold text-[#a28089] uppercase mb-1">
              Buying Quantity
            </label>
            <input
              type="number"
              className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3 rounded-xl"
              value={buyingQty}
              onChange={(e) => setBuyingQty(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#a28089] uppercase mb-1">
              Booked Quantity
            </label>
            <input
              type="number"
              className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3 rounded-xl"
              value={bookedQty}
              onChange={(e) => setBookedQty(Number(e.target.value))}
            />
            {isInvalid && (
              <p className="text-red-500 text-xs mt-1">
                Booked qty cannot exceed buying qty
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-[#a28089] uppercase mb-1">
              Remaining Quantity
            </label>
            <input
              type="number"
              readOnly
              className="w-full bg-gray-100 border border-[#e5eaf5] p-3 rounded-xl cursor-not-allowed"
              value={remainingQty}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#a28089] uppercase mb-1">
              Current Market Price (CMP)
            </label>
            <input
              type="number"
              className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3 rounded-xl"
              value={cmp}
              onChange={(e) => setCmp(Number(e.target.value))}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isInvalid}
            className={`w-full font-bold py-3 rounded-xl ${
              isInvalid 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#8458B3] text-white"
            }`}
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}