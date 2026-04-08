import React from 'react';
import { Target, TrendingUp, AlertTriangle, ShieldCheck, Divide, Percent, DollarSign, Crosshair } from 'lucide-react';

export default function Help() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Knowledge <span className="text-blue-600">Base</span></h1>
        <p className="text-slate-500 text-sm font-semibold mt-2">Understand the mathematics behind your trading edge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HelpCard 
          icon={Target} title="Risk (R)"
          formula="Default = ₹1250 (e.g., 5% of Capital)"
          desc="The 'R' is the most important metric. It is the fixed monetary amount you are willing to lose on a single trade if your Stop Loss hits. R should be balanced, not too big or small."
        />
        <HelpCard 
          icon={Divide} title="Position Sizing"
          formula="R ÷ SL Distance = Total Quantity"
          desc="Your capital decides how much you CAN add, but R decides how much you SHOULD add. It ensures you always lose exactly 1R on every trade, no matter the stock price."
        />
        <HelpCard 
          icon={Crosshair} title="Risk to Reward Ratio (RR)"
          formula="Target Distance ÷ SL Distance"
          desc="The estimated reward compared to your risk. If you risk ₹10 to make ₹30, your RR is 1:3."
        />
        <HelpCard 
          icon={TrendingUp} title="R-Earned (R-Multiple)"
          formula="(Exit Price - Entry Price) ÷ Initial SL Distance"
          desc="The actual result of your trade. If your R is ₹1000 and you made ₹2000, your R-Earned is +2.00R. If you lost ₹500, it is -0.50R."
        />
        <HelpCard 
          icon={Percent} title="Win Rate"
          formula="(Winning Trades ÷ Total Trades) × 100"
          desc="The percentage of your trades that are profitable. A high win rate with a bad ARR can still lose money, while a low win rate with a great ARR can be highly profitable."
        />
        <HelpCard 
          icon={DollarSign} title="ARR (Avg Risk/Reward)"
          formula="Avg Gain per Trade ÷ Avg Loss per Trade"
          desc="This tells you how much bigger your winners are compared to your losers. Professional traders aim for an ARR of 2.0 or higher."
        />
        <HelpCard 
          icon={ShieldCheck} title="Expectancy"
          formula="(Win Rate × Avg R Gain) - (Loss Rate × Avg R Loss)"
          desc="The mathematical edge of your system. If Expectancy > 0R, your system prints money over time. If < 0R, your system will eventually blow up your account."
        />
        <HelpCard 
          icon={AlertTriangle} title="Intensity Metric"
          formula="Expectancy × Total Trades × R"
          desc="Expectancy tells you your edge per trade, Intensity tells you how much money that edge has actually made you in reality."
        />
        <HelpCard 
          icon={ShieldCheck} title="Total Open Risk (TOR)"
          formula="Sum of[ (Entry - Current SL) × Quantity ]"
          desc="Total Open Risk never goes negative (min 0R). It tells you your exact capital exposure right now. Reduce TOR (1-3R) in bear markets, and increase it (4-5R) in bull markets."
        />
      </div>
    </div>
  );
}

const HelpCard = ({ icon: Icon, title, formula, desc }) => (
  <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Icon size={20}/></div>
      <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
    </div>
    <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl mb-4">
      <code className="text-xs font-bold text-slate-600 font-mono">{formula}</code>
    </div>
    <p className="text-sm font-medium text-slate-500 leading-relaxed">{desc}</p>
  </div>
);