import React from 'react';

export default function Help() {
  const metrics = [
    {
      title: "R (Risk/Reward)",
      description: "Core metric for trading. Defines your unit of risk and reward. Essential for position sizing.",
      formula: "Capital × Risk % = 1R Value",
      example: "₹25,000 × 5% = ₹1,250"
    },
    {
      title: "Position Sizing",
      description: "Calculate exact quantity based on R value and stop loss distance. Critical for risk management.",
      formula: "Quantity = R / (Entry - SL)",
      example: "₹1,250 / 10 = 125 units"
    },
    {
      title: "Expectancy",
      description: "Mathematical edge of your trading system. Positive expectancy = profitable system long-term.",
      formula: "(Win Rate × Avg R Gain) - (Loss Rate × Avg R Loss)",
      example: "(60% × 1.5R) - (40% × 1R) = +0.5R"
    },
    {
      title: "Intensity",
      description: "Measures cumulative power of your trades. Helps align trade frequency with system edge.",
      formula: "Expectancy × No. of Trades × R Value",
      example: "0.5R × 20 trades × ₹1,250 = ₹12,500"
    },
    {
      title: "Total Open Risk (TOR)",
      description: "Sum of risk across all open positions. Never exceed market-specific limits.",
      formula: "(Entry - SL) × Open Quantity (for each position)",
      example: "Position 1: (100-95) × 100 = 500. Limits: Bullish 4-5R, Sideways 1-3R, Bearish 1-2R"
    },
    {
      title: "Win Rate & Ratio",
      description: "Percentage of winning vs losing trades. Combined with risk-reward ratio determines profitability.",
      formula: "Win Rate = Winners / Total Closed Trades",
      example: "10 wins / 20 total = 50% win rate"
    }
  ];

  return (
    <div className="max-w-6xl space-y-8">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#8458B3] tracking-tight uppercase" style={{ fontStyle: 'normal' }}>
          Help & <span className="text-[#a0d2eb]">Definitions</span>
        </h1>
        <p className="text-[#a28089] text-base font-medium mt-3">
          Understand the core metrics driving your institutional trading performance.
        </p>
      </div>

      {/* METRICS TABLE */}
      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <div className="p-6">
              {/* Title & Description Row */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[#8458B3] mb-2" style={{ fontStyle: 'normal' }}>
                    {metric.title}
                  </h3>
                  <p className="text-sm text-[#1a1a2e] leading-relaxed">
                    {metric.description}
                  </p>
                </div>
              </div>

              {/* Formula & Example Row */}
              <div className="border-t-2 border-[#d0bdf4] pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Formula */}
                  <div>
                    <p className="text-xs font-black text-[#8458B3] uppercase tracking-wider mb-2">Formula</p>
                    <p className="text-sm font-medium text-[#1a1a2e] bg-[#d0bdf4]/20 p-3 rounded-lg family-mono border-l-4 border-[#8458B3]">
                      {metric.formula}
                    </p>
                  </div>

                  {/* Example */}
                  <div>
                    <p className="text-xs font-black text-[#8458B3] uppercase tracking-wider mb-2">Example</p>
                    <p className="text-sm font-medium text-[#1a1a2e] bg-[#a0d2eb]/20 p-3 rounded-lg border-l-4 border-[#a0d2eb]">
                      {metric.example}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK TIPS */}
      <div className="bg-white/70 backdrop-blur-md border-2 border-[#d0bdf4] rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-black text-[#8458B3] mb-6" style={{ fontStyle: 'normal' }}>
          Quick Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="text-2xl">📊</div>
            <div>
              <p className="font-bold text-[#8458B3] mb-1">Always Calculate Position Size</p>
              <p className="text-sm text-[#1a1a2e]">Never trade without knowing your exact quantity. Use the terminal's auto-calculator.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-2xl">🎯</div>
            <div>
              <p className="font-bold text-[#8458B3] mb-1">Monitor Total Open Risk</p>
              <p className="text-sm text-[#1a1a2e]">Keep TOR within market-appropriate limits. Never exceed 5R in bullish conditions.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-2xl">📈</div>
            <div>
              <p className="font-bold text-[#8458B3] mb-1">Track Your Expectancy</p>
              <p className="text-sm text-[#1a1a2e]">Positive expectancy is your edge. Ensure each trade aligns with your system.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-2xl">⚡</div>
            <div>
              <p className="font-bold text-[#8458B3] mb-1">Review Statistics Regularly</p>
              <p className="text-sm text-[#1a1a2e]">Check your matrix monthly to spot trends and optimize your trading strategy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}