import React from 'react';

export default function Help() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 text-[#494D5F]">
      
      <div>
        <h1 className="text-3xl font-bold text-[#8458B3] tracking-tight uppercase mb-2">
          Help & <span className="text-[#a28089]">Definitions</span>
        </h1>
        <p className="text-[#a28089] text-sm font-medium">
          Understand all trading metrics, formulas and how to use them in real trading.
        </p>
      </div>

      <div className="space-y-6">

        {/* 1 R */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">1. R (Risk / Reward)</h3>
          <p className="text-sm text-[#a28089] mb-3">
            R is the most important metric. Always define your R before taking any trade.
          </p>
          <p className="text-sm">Capital: ₹25,000</p>
          <p className="text-sm">Risk (1R): 5% = ₹1250</p>
          <p className="text-sm mb-3">Reward (1R): 5% = ₹1250</p>
          <p className="text-xs text-[#a28089]">👉 Goal: Keep R consistent. Avoid too big or too small risk.</p>
        </div>

        {/* 2 RR */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">2. Risk Reward Ratio (RR)</h3>
          <p className="text-sm mb-2">Formula:</p>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">RR = Target Distance / SL Distance</code>
          <p className="text-xs text-[#a28089] mt-2">
            👉 Use: Check if trade is worth taking (higher RR = better opportunity)
          </p>
        </div>

        {/* 3 POSITION SIZING */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">3. Position Sizing</h3>
          <p className="text-sm mb-2">Formula:</p>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            Quantity = R / | Entry - SL |
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            👉 Use: Decide how much quantity to buy without increasing risk
          </p>
        </div>

        {/* 4 WIN RATE */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">4. Win Rate</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            Win Rate = Winning Trades / Total Trades
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            👉 Use: Shows accuracy of your trading system
          </p>
        </div>

        {/* 5 ARR */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">5. ARR (Average Risk Reward)</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            Avg Gain / Avg Loss
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            👉 Use: Understand if your profits are bigger than losses
          </p>
        </div>

        {/* 6 EXPECTANCY */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">6. Expectancy</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            (Win Rate × Avg Gain) - (Loss Rate × Avg Loss)
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            👉 Use: If &gt; 0 → profitable system, ≤ 0 → loss system
          </p>
        </div>

        {/* 7 INTENSITY */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">7. Intensity</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            Expectancy × No. of Trades × R
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            👉 Use: Shows total performance of your system
          </p>
        </div>

        {/* 8 TOR */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">8. Total Open Risk (TOR)</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            (Entry - SL) × Open Quantity
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            👉 Use: Control your total risk in market (Never negative)
          </p>
        </div>

        {/* 9 MATRIX METRICS */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-3">9. Performance Matrix Terms</h3>
          <ul className="text-sm space-y-1 text-[#a28089]">
            <li>• Trades Entered → Total trades taken</li>
            <li>• Trades Closed → Completed trades</li>
            <li>• Winners → Profitable trades</li>
            <li>• Losers → Losing trades</li>
            <li>• Avg R Gain → Average profit per winning trade</li>
            <li>• Avg R Loss → Average loss per losing trade</li>
            <li>• Total R Gained → Total R accumulated</li>
            <li>• Total Profit → Final profit from trades</li>
          </ul>
        </div>

      </div>
    </div>
  );
}