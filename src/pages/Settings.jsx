import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { Save, ShieldAlert, User } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useTrades();
  const [rValue, setRValue] = useState(settings?.rValue || 1250);

  const handleSave = async () => {
    await updateSettings({ rValue: parseFloat(rValue) });
    alert("System config updated successfully!");
  };

  return (
    <div className="max-w-4xl animate-in fade-in">
      <h1 className="text-2xl font-black text-slate-100 mb-6 uppercase">System <span className="text-blue-500">Config</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="text-blue-500" />
            <h3 className="font-bold text-slate-200 uppercase text-sm tracking-widest">Risk Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Default Risk (R) Amount</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-3.5 font-bold text-slate-400">₹</span>
                <input 
                  type="number" 
                  className="w-full bg-slate-900 border border-slate-700 p-3 pl-8 rounded-xl text-slate-100 font-bold outline-none focus:border-blue-500 transition-colors"
                  value={rValue}
                  onChange={(e) => setRValue(e.target.value)}
                />
              </div>
            </div>
            <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">
              SAVE CHANGES
            </button>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-sm opacity-50">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-slate-400" />
            <h3 className="font-bold text-slate-200 uppercase text-sm tracking-widest">Trader Profile</h3>
          </div>
          <p className="text-sm text-slate-400">Sync: Active<br/>Plan: Institutional Pro</p>
        </div>
      </div>
    </div>
  );
}