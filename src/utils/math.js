export const R_VALUE = 1250;

export const getISTDate = (timestamp) => {
  if (!timestamp) return new Date();
  const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return isNaN(date.getTime()) ? new Date() : new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

// CLEANED + CONSISTENT CALCULATION
export const processTrade = (t, globalR = 1250) => {
  const entry = Number(t.entry) || 0;
  const sl = Number(t.initialSl || t.sl) || 0;
  const bookedQty = Number(t.bookedQty) || 0;
  const qty = Number(t.qty) || 0;
  const cmp = Number(t.cmp) || entry;
  const exitPrice = t.exitPrice !== undefined ? Number(t.exitPrice) : null;
  const fees = Number(t.fees) || 0;
  const isShort = t.type === 'SHORT';

  const usedPrice = exitPrice ?? cmp;

  const riskDist = Math.abs(entry - sl);
  const riskAmount = (riskDist * bookedQty) || Number(t.riskAmount) || Number(globalR) || 1250;

  let rewardDist = 0;
  if (bookedQty > 0) {
    rewardDist = isShort ? (entry - usedPrice) : (usedPrice - entry);
  }

  const grossPnl = rewardDist * bookedQty;
  const netPnl = grossPnl - fees;

  const rMultiple = (riskDist > 0 && bookedQty > 0)
    ? netPnl / (riskDist * bookedQty)
    : 0;

  return { 
    ...t, 
    symbol: t.symbol || 'UNKNOWN', 
    type: t.type || 'LONG',
    riskDist,
    riskAmount,
    rMultiple,
    netPnl,
    grossPnl,
    isShort,
    dateObj: getISTDate(t.date),
    entry,
    sl,
    qty,
    bookedQty,
    fees,
    exit: usedPrice
  };
};

export const calculateMetrics = (rawTrades, globalR = 1250) => {
  if (!rawTrades || rawTrades.length === 0) return defaultMetrics();

  const validR = Number(globalR) || 1250;

  const trades = rawTrades.map(t => processTrade(t, validR)).sort((a, b) => b.dateObj - a.dateObj);
  
  const closed = trades.filter(t => t.status !== 'Open');
  const open = trades.filter(t => t.status === 'Open');
  const total = closed.length;

  const winners = closed.filter(t => t.rMultiple > 0.1);
  const losers = closed.filter(t => t.rMultiple < -0.1);
  const be = closed.filter(t => t.rMultiple >= -0.1 && t.rMultiple <= 0.1);

  const winRate = total > 0 ? (winners.length / total) : 0;
  const lossRate = total > 0 ? (losers.length / total) : 0;

  const avgRGain = winners.length > 0 ? winners.reduce((s, t) => s + (t.rMultiple || 0), 0) / winners.length : 0;
  const avgRLoss = losers.length > 0 ? Math.abs(losers.reduce((s, t) => s + (t.rMultiple || 0), 0) / losers.length) : 0;
  const avgRBe = be.length > 0 ? be.reduce((s, t) => s + (t.rMultiple || 0), 0) / be.length : -0.01;

  const arr = avgRLoss > 0 ? avgRGain / avgRLoss : 0;
  const expectancy = (winRate * avgRGain) - (lossRate * avgRLoss);
  
  const intensity = expectancy * total * validR;

  const totalNetPnl = closed.reduce((s, t) => s + (t.netPnl || 0), 0);
  const totalR = closed.reduce((s, t) => s + (t.rMultiple || 0), 0);

  const avgGainMoney = avgRGain * validR;
  const avgLossMoney = avgRLoss * validR;
  const avgBeMoney = avgRBe * validR;

  const tor = open.reduce((s, t) => s + ((t.riskDist * t.qty) / validR), 0);

  return {
    processedTrades: trades,
    total,
    winners: winners.length,
    losers: losers.length,
    be: be.length,
    open: open.length,
    winRate,
    avgRGain,
    avgRLoss,
    avgRBe,
    arr,
    expectancy,
    totalR,
    tor,
    intensity,
    netPnl: totalNetPnl,
    avgGainMoney,
    avgLossMoney,
    avgBeMoney,
    totalProfit: totalNetPnl
  };
};

const defaultMetrics = () => ({
  processedTrades: [],
  total: 0,
  winners: 0,
  losers: 0,
  be: 0,
  open: 0,
  winRate: 0,
  avgRGain: 0,
  avgRLoss: 0,
  avgRBe: 0,
  arr: 0,
  expectancy: 0,
  totalR: 0,
  tor: 0,
  intensity: 0,
  netPnl: 0,
  avgGainMoney: 0,
  avgLossMoney: 0,
  avgBeMoney: 0,
  totalProfit: 0
});

export const groupTrades = (trades, type) => {
  const groups = {};
  trades.forEach(rawT => {
    const t = processTrade(rawT);
    const d = t.dateObj;
    if (isNaN(d.getTime())) return;
    
    let key = type === 'Monthly'
      ? d.toLocaleString('en-IN', { month: 'short', year: 'numeric' }) 
      : type === 'Yearly'
      ? d.getFullYear().toString() 
      : `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;

    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  return groups;
};

export const calculateDays = (entryDate, exitDate) => {
  if (!entryDate) return 0;
  const start = entryDate?.seconds ? new Date(entryDate.seconds * 1000) : new Date(entryDate);
  const end = exitDate ? new Date(exitDate) : new Date();
  if (isNaN(start.getTime())) return 0;
  return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
};