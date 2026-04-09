export const R_VALUE = 1250;

// Date Normalizer (Asia/Kolkata)
export const getISTDate = (timestamp) => {
  if (!timestamp) return new Date();
  const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

// Core Trade Processor (Fixes LONG/SHORT, PnL, R-Multiple, Fees)
export const processTrade = (t, globalR = 1250) => {
  const entry = parseFloat(t.entry);
  const exit = parseFloat(t.exitPrice || t.cmp || t.entry);
  const sl = parseFloat(t.initialSl || t.sl);
  const qty = parseFloat(t.quantity);
  const fees = parseFloat(t.fees || 0);
  const isShort = t.type === 'SHORT'; // Check if trade is short

  const riskDist = Math.abs(entry - sl);
  const riskAmount = riskDist * qty || parseFloat(t.riskAmount) || globalR;

  // Exact R-Multiple Formula
  let rewardDist = isShort ? (entry - exit) : (exit - entry);
  let rMultiple = riskDist > 0 ? rewardDist / riskDist : 0;

  // Exact PnL Formula
  let grossPnl = rewardDist * qty;
  let netPnl = grossPnl - fees;

  return { ...t, riskDist, riskAmount, rMultiple, netPnl, grossPnl, isShort, dateObj: getISTDate(t.date) };
};

// Global Metrics Calculator
export const calculateMetrics = (rawTrades, globalR = 1250) => {
  // 1. Process & Sort Trades (Latest First)
  const trades = rawTrades.map(t => processTrade(t, globalR)).sort((a, b) => b.dateObj - a.dateObj);
  
  const closed = trades.filter(t => t.status !== 'Open');
  const open = trades.filter(t => t.status === 'Open');
  const total = closed.length;

  const winners = closed.filter(t => t.rMultiple > 0.1);
  const losers = closed.filter(t => t.rMultiple < -0.1);
  const be = closed.filter(t => t.rMultiple >= -0.1 && t.rMultiple <= 0.1);

  const winRate = total > 0 ? (winners.length / total) : 0;
  const lossRate = total > 0 ? (losers.length / total) : 0;

  const avgRGain = winners.length > 0 ? winners.reduce((s, t) => s + t.rMultiple, 0) / winners.length : 0;
  const avgRLoss = losers.length > 0 ? Math.abs(losers.reduce((s, t) => s + t.rMultiple, 0) / losers.length) : 0;

  const arr = avgRLoss > 0 ? avgRGain / avgRLoss : 0;
  const expectancy = (winRate * avgRGain) - (lossRate * avgRLoss);
  
  // Total PnL (Deducting fees automatically due to processTrade)
  const totalNetPnl = closed.reduce((s, t) => s + t.netPnl, 0);
  const intensity = expectancy * total * globalR;

  const tor = open.reduce((s, t) => s + (Math.abs(t.entry - t.sl) * t.quantity) / globalR, 0);

  return {
    processedTrades: trades, total, winners: winners.length, losers: losers.length, be: be.length, open: open.length,
    winRate, avgRGain, avgRLoss, arr, expectancy, tor, intensity, totalNetPnl
  };
};

export const groupTrades = (trades, type) => {
  const groups = {};
  trades.forEach(t => {
    const d = t.dateObj;
    let key = type === 'Monthly' ? d.toLocaleString('en-IN', { month: 'short', year: 'numeric' }) 
            : type === 'Yearly' ? d.getFullYear().toString() 
            : `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;
    if (!groups[key]) groups[key] =[];
    groups[key].push(t);
  });
  return groups;
};