// Dashboard.jsx
import React from 'react';
import { useTrades } from '../context/TradeContext';
import { calculateMetrics } from '../utils/math';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import TradeLogs from '../components/TradeLogs';

export default function Dashboard() {
  const { trades, settings } = useTrades();
  const m = calculateMetrics(trades, settings?.rValue || 1250);

  // 1. Metric Calculations
  const safeNetPnl = isNaN(m.totalNetPnl) ? 0 : m.totalNetPnl;
  const totalTrades = trades?.length || 0;

  const winningTrades = (trades ||[]).filter(t => Number(t.netPnl ?? t.pnl ?? 0) > 0);
  const totalWinPnl = winningTrades.reduce((sum, t) => sum + Number(t.netPnl ?? t.pnl ?? 0), 0);
  const avgProfit = winningTrades.length > 0 ? totalWinPnl / winningTrades.length : 0;

  // 2. Chart Data Preparation
  let accPnl = 0;
  // Reverse is used assuming the context stores newest trades first, to plot them chronologically
  const lineChartData = [...(trades || [])].reverse().map((t, i) => {
    const tradePnl = Number(t.netPnl ?? t.pnl ?? t.realizedPnl ?? 0);
    accPnl += tradePnl;
    return {
      name: t.date || `T${i + 1}`,
      cumulativePnl: accPnl
    };
  });

  const winsCount = winningTrades.length;
  const lossCount = (trades ||[]).filter(t => Number(t.netPnl ?? t.pnl ?? 0) <= 0).length;

  const pieData =[
    { name: 'Wins', value: winsCount, fill: '#10b981' }, // Tailwind emerald-500
    { name: 'Losses', value: lossCount, fill: '#f43f5e' } // Tailwind rose-500
  ];

  // 3. UI Components
  const MetricCard = ({ title, value, sub, isPnl = false }) => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
    const isPositive = numValue >= 0;
    
    // Default to white/slate, apply Green/Red strictly if it's a P&L metric
    let colorClass = "text-slate-100";
    if (isPnl) {
      colorClass = isPositive ? "text-emerald-500" : "text-rose-500";
    }

    return (
      <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-lg w-full flex flex-col justify-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 break-words">
          {title}
        </p>
        <h2 className={`text-3xl font-bold ${colorClass} break-words`}>
          {value}
        </h2>
        {sub && <p className="text-[11px] font-medium text-slate-500 mt-2 break-words">{sub}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-6 space-y-6 animate-in fade-in duration-500 w-full max-w-full">
      
      {/* Header */}
      <div className="w-full">
        <h1 className="text-2xl font-bold text-slate-100 break-words tracking-tight">
          TRADING <span className="text-emerald-500">DASHBOARD</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Performance Overview & Analytics</p>
      </div>

      {/* --- Section 1: Top Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <MetricCard
          title="Total P&L"
          value={`₹${Math.floor(safeNetPnl).toLocaleString()}`}
          sub="Net Realized Profit"
          isPnl={true}
        />
        <MetricCard
          title="Total Trades"
          value={totalTrades}
          sub="Executed Positions"
        />
        <MetricCard
          title="Win Rate"
          value={`${((m?.winRate || 0) * 100).toFixed(1)}%`}
          sub="System Accuracy"
        />
        <MetricCard
          title="Avg Profit"
          value={`₹${Math.floor(avgProfit).toLocaleString()}`}
          sub="Per Winning Trade"
          isPnl={true}
        />
      </div>

      {/* --- Section 2: Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        {/* Line Chart: Cumulative P&L */}
        <div className="lg:col-span-2 bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-lg h-[400px] flex flex-col">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Cumulative P&L
          </h3>
          <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₹${value}`} 
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativePnl"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Win vs Loss */}
        <div className="lg:col-span-1 bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-lg h-[400px] flex flex-col items-center">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 w-full text-left">
            Win vs Loss
          </h3>
          <div className="flex-1 w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4 w-full justify-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              <span className="text-sm font-medium text-slate-300">Wins ({winsCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
              <span className="text-sm font-medium text-slate-300">Losses ({lossCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 3: TradeLogs Component --- */}
      <div className="w-full pt-4">
        <TradeLogs />
      </div>

    </div>
  );
}