import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { Save, User, ShieldAlert } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useTrades();
  const [rValue, setRValue] = useState(settings?.rValue || 1250);

  const handleSave = async () => {
    await updateSettings({ rValue: parseFloat(rValue) });
    alert("System settings updated successfully!");
  };

  return (
    <div className="p-8 max-w-4xl animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-slate-900 mb-8">SYSTEM <span className="text-blue-600">CONFIG</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Risk Management Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <ShieldAlert size={24} />
            </div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Risk Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Default Risk (R) Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 font-bold text-slate-400">₹</span>
                <input 
                  type="number" 
                  className="w-full bg-gray-50 border border-gray-200 p-3 pl-8 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                  value={rValue}
                  onChange={(e) => setRValue(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">* This value is used to calculate Quantity and Intensity.</p>
            </div>

            <button 
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <Save size={18} /> SAVE CHANGES
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm opacity-60 pointer-events-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl">
              <User size={24} />
            </div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Trader Profile</h3>
          </div>
          <p className="text-sm text-slate-500">Cloud Sync: Active<br/>Plan: Institutional Pro</p>
        </div>
      </div>
    </div>
  );
}