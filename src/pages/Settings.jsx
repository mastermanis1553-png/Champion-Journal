import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { ShieldAlert, User } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useTrades();
  const [rValue, setRValue] = useState(settings?.rValue || 1250);

  const handleSave = async () => {
    await updateSettings({ rValue: parseFloat(rValue) });
    alert("System config updated successfully!");
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-black text-[#8458B3] uppercase tracking-tight" style={{ fontStyle: 'normal' }}>
          System <span className="text-[#a0d2eb]">Config</span>
        </h1>
        <p className="text-[#a28089] text-sm mt-3 font-medium">Configure your trading terminal settings</p>
      </div>

      {/* SETTINGS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Risk Settings */}
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="text-[#8458B3]" size={24} />
            <h3 className="font-black text-[#8458B3] uppercase text-sm tracking-widest" style={{ fontStyle: 'normal' }}>Risk Settings</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-black text-[#8458B3] uppercase tracking-widest block mb-2">Default Risk (R) Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 font-black text-[#a28089]">₹</span>
                <input 
                  type="number" 
                  className="w-full bg-white border-2 border-[#d0bdf4] p-3 pl-8 rounded-xl text-[#1a1a2e] font-black outline-none focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 transition-all"
                  value={rValue}
                  onChange={(e) => setRValue(e.target.value)}
                />
              </div>
              <p className="text-xs text-[#a28089] mt-2">This is your unit of risk for calculating position sizes.</p>
            </div>
            <button onClick={handleSave} className="w-full bg-[#8458B3] hover:bg-[#a0d2eb] hover:text-[#8458B3] text-white font-black py-3 rounded-xl transition-all duration-200 uppercase text-sm tracking-widest shadow-lg">
              SAVE CHANGES
            </button>
          </div>
        </div>

        {/* Trader Profile */}
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-8 rounded-2xl shadow-lg opacity-60">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-[#a28089]" size={24} />
            <h3 className="font-black text-[#8458B3] uppercase text-sm tracking-widest" style={{ fontStyle: 'normal' }}>Trader Profile</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-[#a28089] uppercase tracking-widest mb-1">Sync Status</p>
              <p className="text-sm text-[#1a1a2e] font-medium">Active</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#a28089] uppercase tracking-widest mb-1">Plan</p>
              <p className="text-sm text-[#1a1a2e] font-medium">Institutional Pro</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}