// MistakeForm.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function MistakeForm({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    date: '',
    type: '',
    desc: '',
    tag: '',
    severity: 'Low'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.type || !form.desc) return;

    const newMistake = {
      id: Date.now(),
      date: form.date || new Date().toISOString().split('T')[0],
      type: form.type,
      desc: form.desc,
      tag: form.tag || '-',
      severity: form.severity
    };

    onAdd(newMistake);
    setIsOpen(false);

    setForm({
      date: '',
      type: '',
      desc: '',
      tag: '',
      severity: 'Low'
    });
  };

  const modal = isOpen && (
    <div className="fixed inset-0 bg-[#494D5F]/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4 overflow-y-auto w-full max-w-full">
      <div className="bg-white border border-[#d0bdf4] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl relative max-w-full">

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 text-[#a28089] hover:text-[#8458B3]"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg sm:text-xl font-bold text-[#8458B3] mb-4 sm:mb-6 uppercase tracking-tight break-words">
          Log Mistake
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-[#494D5F] w-full max-w-full">

          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase">Date</label>
            <input
              type="date"
              className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:border-[#a0d2eb] max-w-full"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase">Mistake Type</label>
            <input
              type="text"
              placeholder="e.g. Early Entry, Overtrade"
              className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:border-[#a0d2eb] break-words max-w-full"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase">Description</label>
            <textarea
              rows="3"
              placeholder="What went wrong?"
              className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:border-[#a0d2eb] resize-none break-words max-w-full"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase">Setup / Tag</label>
            <input
              type="text"
              placeholder="e.g. Breakout, Scalping"
              className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:border-[#a0d2eb] break-words max-w-full"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-[#a28089] uppercase">Severity</label>
            <select
              className="w-full bg-[#e5eaf5] border border-[#d0bdf4] p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-[#8458B3] outline-none max-w-full"
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#8458B3] hover:opacity-90 text-white font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl mt-3 sm:mt-4 transition uppercase text-xs sm:text-sm tracking-widest shadow-md max-w-full"
          >
            Save Mistake
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#8458B3] text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition"
      >
        + Log Mistake
      </button>

      {modal}
    </>
  );
}