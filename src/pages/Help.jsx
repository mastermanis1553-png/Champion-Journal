import React from 'react';

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 text-[#494D5F]">
      <div>
        <h1 className="text-3xl font-bold text-[#8458B3] tracking-tight uppercase mb-2">Help & <span className="text-[#a28089]">Definitions</span></h1>
        <p className="text-[#a28089] text-sm font-medium">Understand the core metrics driving your institutional performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* R VALUE */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="text-[#8458B3] font-bold uppercase tracking-widest text-sm mb-2">R (Risk/Reward)</h3>
          <p className="text-sm font-medium text-[#a28089] mb-4">R is the most imp metric for trading. It should be balanced. Find your R before taking trades.</p>
          <div className="bg-[#f8f9fc] p-3 rounded-xl border border-[#e5eaf5] text-xs">
            <span className="text-[#a28089]">Capital:</span> <span className="font-bold text-[#494D5F]">₹25,000</span><br/>
            <span className="text-[#a28089]">Risk (1R):</span> <span className="font-bold text-rose-500">5% (₹1250)</span><br/>
            <span className="text-[#a28089]">Reward (1R):</span> <span className="font-bold text-emerald-500">5% (₹1250)</span>
          </div>
        </div>

        {/* POSITION SIZING */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="text-[#8458B3] font-bold uppercase tracking-widest text-sm mb-2">Position Sizing</h3>
          <p className="text-sm font-medium text-[#a28089] mb-4">Capital decides how much QTY you can add, but R dictates it.</p>
          <code className="block bg-[#f8f9fc] p-3 rounded-xl border border-[#e5eaf5] text-[#8458B3] text-xs font-bold">
            Formula: Total Quantity = R / | Entry - SL |
          </code>
        </div>

        {/* EXPECTANCY */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="text-[#8458B3] font-bold uppercase tracking-widest text-sm mb-2">Expectancy</h3>
          <p className="text-sm font-medium text-[#a28089] mb-4">&gt; 0R is profitable. Defines system accuracy.</p>
          <code className="block bg-[#f8f9fc] p-3 rounded-xl border border-[#e5eaf5] text-[#8458B3] text-xs font-bold leading-relaxed">
            Formula:<br/>
            (Win Rate * Avg R Gain) - (Loss Rate * Avg R Loss)
          </code>
        </div>

        {/* INTENSITY */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="text-[#8458B3] font-bold uppercase tracking-widest text-sm mb-2">Intensity Metric</h3>
          <p className="text-sm font-medium text-[#a28089] mb-4">Align Intensity with Expectancy. Trade with the market.</p>
          <code className="block bg-[#f8f9fc] p-3 rounded-xl border border-[#e5eaf5] text-[#8458B3] text-xs font-bold">
            Formula: Expectancy * No. of Trades * R
          </code>
        </div>

        {/* TOR */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm md:col-span-2">
          <h3 className="text-[#8458B3] font-bold uppercase tracking-widest text-sm mb-2">Total Open Risk (TOR)</h3>
          <p className="text-sm font-medium text-[#a28089] mb-4">Never negative. Defines maximum allowable capital exposure based on market condition. (Bullish: 4R-5R, Sideways: 1R-3R, Bearish: 1R/No Trades).</p>
          <code className="block bg-[#f8f9fc] p-3 rounded-xl border border-[#e5eaf5] text-[#8458B3] text-xs font-bold">
            Formula: ( | Entry Price - Current SL | ) * Open Quantity
          </code>
        </div>

      </div>
    </div>
  );
}