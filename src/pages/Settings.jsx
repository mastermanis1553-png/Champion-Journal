import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { Save, ShieldAlert, User } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useTrades();
  const[rValue, setRValue] = useState(settings?.rValue || 1250);

  const handleSave = async () => {
    await updateSettings({ rValue: parseFloat(rValue) });
    alert("System config updated successfully!");
  };

  return (
    <div className="max-w-4xl animate-in fade-in text-[#494D5F]">
      <h1 className="text-2xl font-bold text-[#8458B3] mb-6 uppercase tracking-tight">System <span className="text-[#a28089]">Config</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RISK SETTINGS */}
        <div className="bg-white border border-[#d0bdf4] p-8 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="text-[#a0d2eb]" />
            <h3 className="font-bold text-[#8458B3] uppercase text-sm tracking-widest">Risk Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest">Default Risk (R) Amount</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-3.5 font-bold text-[#a28089]">₹</span>
                <input 
                  type="number" 
                  className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3 pl-8 rounded-xl text-[#494D5F] font-bold outline-none focus:border-[#a0d2eb] transition-colors"
                  value={rValue}
                  onChange={(e) => setRValue(e.target.value)}
                />
              </div>
            </div>
            <button onClick={handleSave} className="w-full bg-[#8458B3] hover:opacity-90 text-white font-bold py-3 rounded-xl transition-opacity uppercase text-xs tracking-widest shadow-md">
              Save Changes
            </button>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-[#f8f9fc] border border-[#e5eaf5] p-8 rounded-2xl shadow-sm opacity-80 pointer-events-none">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-[#a28089]" />
            <h3 className="font-bold text-[#a28089] uppercase text-sm tracking-widest">Trader Profile</h3>
          </div>
          <p className="text-sm text-[#a28089] font-medium leading-relaxed">
            Status: Active Sync <br/>
            Timezone: Asia/Kolkata <br/>
            Plan: Institutional Pro
          </p>
        </div>
      </div>
    </div>
  );
}