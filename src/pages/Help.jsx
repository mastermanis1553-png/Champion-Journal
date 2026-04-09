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
            R is the base unit of your trading system. It represents how much you are willing to lose or gain per trade.
            Every trade should be planned in terms of R, not emotions or random quantity.
          </p>
          <p className="text-sm">Capital: ₹25,000</p>
          <p className="text-sm">Risk (1R): 5% = ₹1250</p>
          <p className="text-sm mb-3">Reward (1R): 5% = ₹1250</p>
          <p className="text-xs text-[#a28089]">
            👉 Why important: If your R is fixed, your losses stay controlled and your system becomes stable over time.
          </p>
        </div>

        {/* 2 RR */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">2. Risk Reward Ratio (RR)</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            RR = Target Distance / SL Distance
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            RR tells you whether the trade is worth taking or not. A trade with low RR means high risk and low reward.
            Always aim for better RR so even if your win rate is low, you can still stay profitable.
          </p>
        </div>

        {/* 3 POSITION SIZING */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">3. Position Sizing</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            Quantity = R / | Entry - SL |
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            Position sizing ensures that you never risk more than your defined R.
            Even if SL is big or small, your quantity adjusts automatically.
          </p>
          <p className="text-xs text-[#a28089] mt-1">
            👉 Goal: Protect capital first, profit comes later.
          </p>
        </div>

        {/* 4 WIN RATE */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">4. Win Rate</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            Win Rate = Winning Trades / Total Trades
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            Win rate shows how often your trades are profitable.
            But high win rate alone is not enough — it must be combined with good RR.
          </p>
        </div>

        {/* 5 ARR */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">5. ARR (Average Risk Reward)</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            Avg Gain / Avg Loss
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            ARR tells you how big your profits are compared to your losses.
            If ARR is greater than 1, your system has an edge.
          </p>
        </div>

        {/* 6 EXPECTANCY */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">6. Expectancy</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            (Win Rate × Avg Gain) - (Loss Rate × Avg Loss)
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            Expectancy is the most important system metric.
            If expectancy is positive, your system will make money in the long run.
            If negative, you will lose money even with high win rate.
          </p>
        </div>

        {/* 7 INTENSITY */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">7. Intensity</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            Expectancy × No. of Trades × R
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            Intensity shows your total outcome based on how often you trade and how good your system is.
            More trades with bad expectancy = losses. Fewer trades with good expectancy = profit.
          </p>
        </div>

        {/* 8 TOR */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-2">8. Total Open Risk (TOR)</h3>
          <code className="text-xs block bg-[#f8f9fc] p-2 rounded">
            (Entry - SL) × Open Quantity
          </code>
          <p className="text-xs text-[#a28089] mt-2">
            TOR tells how much total risk you currently have in the market.
            Never let your TOR go too high.
          </p>
          <p className="text-xs text-[#a28089] mt-1">
            👉 Bull Market: 4R–5R allowed<br/>
            👉 Sideways: 1R–3R<br/>
            👉 Bear Market: 0–1R (or no trades)
          </p>
        </div>

        {/* PRACTICAL SECTION */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-3">9. Practical Trading Rules</h3>
          
          <ul className="text-sm space-y-2 text-[#a28089]">
            <li>
              • <b>Risk-Free Trade:</b> When price moves in your favor, shift SL to entry.
              This removes risk and protects capital.
            </li>
            <li>
              • <b>SL Trailing:</b> Move your stop loss step by step as price moves.
              Lock profits instead of waiting for target blindly.
            </li>
            <li>
              • <b>Why Log Mistakes:</b> Your growth comes from mistakes.
              If you don’t track them, you will repeat them.
            </li>
            <li>
              • <b>Use Diary Page:</b> After each trading day, log what went wrong.
              Review weekly/monthly to improve discipline.
            </li>
            <li>
              • <b>Goal:</b> Reduce mistakes, improve expectancy, increase intensity.
            </li>
          </ul>
        </div>

        {/* MATRIX TERMS */}
        <div className="bg-white border border-[#d0bdf4] p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-[#8458B3] mb-3">10. Performance Matrix Terms</h3>
          <ul className="text-sm space-y-1 text-[#a28089]">
            <li>• Trades Entered → Total trades taken</li>
            <li>• Trades Closed → Completed trades</li>
            <li>• Winners → Profitable trades</li>
            <li>• Losers → Losing trades</li>
            <li>• Avg R Gain → Avg profit per winning trade</li>
            <li>• Avg R Loss → Avg loss per losing trade</li>
            <li>• Total R Gained → Total R accumulated</li>
            <li>• Total Profit → Final profit</li>
          </ul>
        </div>

      </div>
    </div>
  );
}