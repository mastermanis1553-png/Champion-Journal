// Help.jsx
import React from 'react';

export default function Help() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 text-[#494D5F] w-full max-w-full">
      
      <div className="w-full max-w-full">
        <h1 className="text-3xl font-bold text-[#8458B3] tracking-tight uppercase mb-2 break-words">
          Help & <span className="text-[#a28089]">Definitions</span>
        </h1>
        <p className="text-[#a28089] text-sm font-medium break-words">
          Understand all trading metrics, formulas and how to use them in real trading.
        </p>
      </div>

      <div className="space-y-6 w-full max-w-full">

        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <h3 className="font-bold text-[#8458B3] mb-2 break-words">1. R (Risk / Reward)</h3>
          <p className="text-sm text-[#a28089] mb-3 break-words">
            R is the base unit of your trading system. It represents how much you are willing to lose or gain per trade.
            Every trade should be planned in terms of R, not emotions or random quantity.
          </p>
          <p className="text-sm break-words">Capital: ₹25,000</p>
          <p className="text-sm break-words">Risk (1R): 5% = ₹1250</p>
          <p className="text-sm mb-3 break-words">Reward (1R): 5% = ₹1250</p>
          <p className="text-xs text-[#a28089] break-words">
            👉 Why important: If your R is fixed, your losses stay controlled and your system becomes stable over time.
          </p>
        </div>

        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <h3 className="font-bold text-[#8458B3] mb-2 break-words">2. Risk Reward Ratio (RR)</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded break-words">
            RR = Target Distance / SL Distance
          </code>
          <p className="text-xs text-[#a28089] mt-2 break-words">
            RR tells you whether the trade is worth taking or not. A trade with low RR means high risk and low reward.
            Always aim for better RR so even if your win rate is low, you can still stay profitable.
          </p>
        </div>

        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <h3 className="font-bold text-[#8458B3] mb-2 break-words">3. Position Sizing</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded break-words">
            Quantity = R / | Entry - SL |
          </code>
          <p className="text-xs text-[#a28089] mt-2 break-words">
            Position sizing ensures that you never risk more than your defined R.
            Even if SL is big or small, your quantity adjusts automatically.
          </p>
        </div>

        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <h3 className="font-bold text-[#8458B3] mb-2 break-words">4. Win Rate</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded break-words">
            Win Rate = Winning Trades / Total Trades
          </code>
          <p className="text-xs text-[#a28089] mt-2 break-words">
            Win rate shows how often your trades are profitable.
            But high win rate alone is not enough — it must be combined with good RR.
          </p>
        </div>

        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <h3 className="font-bold text-[#8458B3] mb-2 break-words">5. ARR (Average Risk Reward)</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded break-words">
            Avg Gain / Avg Loss
          </code>
          <p className="text-xs text-[#a28089] mt-2 break-words">
            ARR tells you how big your profits are compared to your losses.
            If ARR is greater than 1, your system has an edge.
          </p>
        </div>

        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <h3 className="font-bold text-[#8458B3] mb-2 break-words">6. Expectancy</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded break-words">
            (Win Rate × Avg Gain) - (Loss Rate × Avg Loss)
          </code>
          <p className="text-xs text-[#a28089] mt-2 break-words">
            Expectancy is the most important system metric.
          </p>
        </div>

        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <h3 className="font-bold text-[#8458B3] mb-2 break-words">7. Intensity</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded break-words">
            Expectancy × No. of Trades × R
          </code>
          <p className="text-xs text-[#a28089] mt-2 break-words">
            Intensity shows your total outcome based on how often you trade.
          </p>
        </div>

        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm w-full max-w-full">
          <h3 className="font-bold text-[#8458B3] mb-2 break-words">8. Total Open Risk (TOR)</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded break-words">
            (Entry - SL) × Open Quantity
          </code>
          <p className="text-xs text-[#a28089] mt-2 break-words">
            TOR tells how much total risk you currently have in the market.
          </p>
        </div>

      </div>
    </div>
  );
}