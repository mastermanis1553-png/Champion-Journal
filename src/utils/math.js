export const R_VALUE = 1250;

// 1. Date Normalizer (Asia/Kolkata)
export const getISTDate = (timestamp) => {
  if (!timestamp) return new Date();
  const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

// 2. Core Trade Processor (Fixes LONG/SHORT, PnL, R-Multiple, Fees)
export const processTrade = (t, globalR = 1250) => {
  const entry = parseFloat(t.entry);
  const exit = parseFloat(t.exitPrice || t.cmp || t.entry);
  const sl = parseFloat(t.initialSl || t.sl);
  const qty = parseFloat(t.quantity);
  const fees = parseFloat(t.fees || 0);
  const isShort = t.type === 'SHORT';

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

// 3. YAHAN THA ERROR: Missing calculateLiveR (Added Long/Short Logic)
export const calculateLiveR = (trade, cmp) => {
  if (!cmp || !trade.entry || !trade.initialSl) return 0;
  const slDistance = Math.abs(trade.entry - trade.initialSl);
  if (slDistance === 0) return 0;
  
  const isShort = trade.type === 'SHORT';
  const rewardDist = isShort ? (trade.entry - cmp) : (cmp - trade.entry);
  
  return rewardDist / slDistance;
};

// 4. Calculate Positions Metrics
export const calculatePositionsMetrics = (trades) => {
  const open = trades.filter(t => t.status === 'Open');
  const totalExposure = open.reduce((s, t) => s + (t.entry * t.quantity), 0);
  const totalOpenRisk = open.reduce((s, t) => s + (Math.abs(t.entry - t.sl) * t.quantity), 0);
  const totalUnrealized = open.reduce((s, t) => {
    const cmp = t.cmp || t.entry;
    const isShort = t.type === 'SHORT';
    const pnl = isShort ? (t.entry - cmp) * t.quantity : (cmp - t.entry) * t.quantity;
    return s + pnl;
  }, 0);
  return { totalExposure, totalOpenRisk, totalUnrealized };
};

// 5. Global Metrics Calculator (For Dashboard & Summary)
export const calculateMetrics = (rawTrades, globalR = 1250) => {
  const validR = parseFloat(globalR) || 1250;
  const trades = rawTrades.map(t => processTrade(t, validR)).sort((a, b) => b.dateObj - a.dateObj);
  
  const closed = trades.filter(t => t.status !== 'Open');
  const open = trades.filter(t => t.status === 'Open');
  const total = closed.length;

  const winners = closed.filter(t => t.rMultiple > 0.1);
  const losers = closed.filter(t => t.rMultiple < -0.1);
  const be = closed.filter(t => t.rMultiple >= -0.1 && t.rMultiple <= 0.1);

  const winRate = total > 0 ? (winners.length / total) : 0;
  const lossRate = total > 0 ? (losers.length / total) : 0;

  const avgRGain = winners.length > 0 ? winners.reduce((s, t) => s + (parseFloat(t.rMultiple)||0), 0) / winners.length : 0;
  const avgRLoss = losers.length > 0 ? Math.abs(losers.reduce((s, t) => s + (parseFloat(t.rMultiple)||0), 0) / losers.length) : 0;
  const avgRBe = be.length > 0 ? be.reduce((s, t) => s + (parseFloat(t.rMultiple)||0), 0) / be.length : -0.01;

  const arr = avgRLoss > 0 ? avgRGain / avgRLoss : 0;
  const expectancy = (winRate * avgRGain) - (lossRate * avgRLoss);
  
  // Total Net PnL (Fees already deducted in processTrade)
  const totalNetPnl = closed.reduce((s, t) => s + t.netPnl, 0);
  const intensity = expectancy * total * validR;

  const totalR = closed.reduce((s, t) => s + (parseFloat(t.rMultiple)||0), 0);
  const avgGainMoney = avgRGain * validR;
  const avgLossMoney = avgRLoss * validR;
  const avgBeMoney = avgRBe * validR;

  const tor = open.reduce((s, t) => {
    const slDist = Math.abs(t.entry - t.sl);
    const currentRisk = slDist * t.quantity;
    return s + (currentRisk / (parseFloat(t.riskAmount) || validR));
  }, 0);

  return {
    processedTrades: trades, total, winners: winners.length, losers: losers.length, be: be.length, open: open.length,
    winRate, avgRGain, avgRLoss, avgRBe, arr, expectancy, totalR, tor, 
    intensity, netPnl: totalNetPnl, avgGainMoney, avgLossMoney, avgBeMoney, totalProfit: totalNetPnl
  };
};

// 6. Group Trades (For Matrix/Summary Page)
export const groupTrades = (trades, type) => {
  const groups = {};
  trades.forEach(t => {
    const d = t.date?.seconds ? new Date(t.date.seconds * 1000) : new Date(t.date);
    let key;
    if (type === 'Monthly') key = d.toLocaleString('default', { month: 'short' }) + " " + d.getFullYear();
    else if (type === 'Yearly') key = d.getFullYear().toString();
    else key = `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;
    if (!groups[key]) groups[key] =[];
    groups[key].push(t);
  });
  return groups;
};

// 7. Calculate Days Held
export const calculateDays = (entryDate, exitDate) => {
  const start = entryDate?.seconds ? new Date(entryDate.seconds * 1000) : new Date(entryDate);
  const end = exitDate ? new Date(exitDate) : new Date();
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};