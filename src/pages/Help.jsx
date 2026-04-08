import React from 'react';

export default function Help() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-black text-[#8458B3] tracking-tight uppercase italic mb-2">Help & <span className="text-[#a0d2eb]">Definitions</span></h1>
        <p className="text-[#a28089] text-base font-medium">Understand the core metrics driving your institutional performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* R VALUE */}
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <h3 className="text-[#8458B3] font-black uppercase tracking-widest text-sm mb-3">R (Risk/Reward)</h3>
          <p className="text-sm font-medium text-[#a28089] mb-4">R is the most important metric for trading. It should be balanced. Find your R before taking trades.</p>
          <div className="bg-[#e5eaf5] p-4 rounded-lg border-2 border-[#d0bdf4] text-xs space-y-2">
            <div><span className="text-[#a28089]">Capital:</span> <span className="font-black text-[#333]">₹25,000</span></div>
            <div><span className="text-[#a28089]">Risk (1R):</span> <span className="font-black text-rose-600">5% (₹1250)</span></div>
            <div><span className="text-[#a28089]">Reward (1R):</span> <span className="font-black text-emerald-600">5% (₹1250)</span></div>
          </div>
        </div>

        {/* POSITION SIZING */}
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <h3 className="text-[#8458B3] font-black uppercase tracking-widest text-sm mb-3">Position Sizing</h3>
          <p className="text-sm font-medium text-[#a28089] mb-4">Capital decides how much QTY you can add, but R dictates it.</p>
          <code className="block bg-[#e5eaf5] p-4 rounded-lg border-2 border-[#d0bdf4] text-[#8458B3] text-xs font-black">
            Formula: Total Quantity = R / (Entry - SL)
          </code>
        </div>

        {/* EXPECTANCY */}
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <h3 className="text-[#8458B3] font-black uppercase tracking-widest text-sm mb-3">Expectancy</h3>
          <p className="text-sm font-medium text-[#a28089] mb-4">&gt; 0R is profitable. Defines system accuracy.</p>
          <code className="block bg-[#e5eaf5] p-4 rounded-lg border-2 border-[#d0bdf4] text-[#8458B3] text-xs font-black leading-relaxed">
            Formula:<br/>
            (Win Rate * Avg R Gain) - (Loss Rate * Avg R Loss)
          </code>
        </div>

        {/* INTENSITY */}
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg">
          <h3 className="text-[#8458B3] font-black uppercase tracking-widest text-sm mb-3">Intensity Metric</h3>
          <p className="text-sm font-medium text-[#a28089] mb-4">Align Intensity with Expectancy. Trade with the market.</p>
          <code className="block bg-[#e5eaf5] p-4 rounded-lg border-2 border-[#d0bdf4] text-[#8458B3] text-xs font-black">
            Formula: Expectancy * No. of Trades * R
          </code>
        </div>

        {/* TOR */}
        <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] p-6 rounded-2xl shadow-lg md:col-span-2">
          <h3 className="text-[#8458B3] font-black uppercase tracking-widest text-sm mb-3">Total Open Risk (TOR)</h3>
          <p className="text-sm font-medium text-[#a28089] mb-4">Never negative. Defines maximum allowable capital exposure based on market condition. (Bullish: 4R-5R, Sideways: 1R-3R, Bearish: 1R-2R)</p>
          <code className="block bg-[#e5eaf5] p-4 rounded-lg border-2 border-[#d0bdf4] text-[#8458B3] text-xs font-black">
            Formula: (Entry Price - Current SL) * Open Quantity
          </code>
        </div>

      </div>
    </div>
  );
}