export const R_VALUE = 1250;

export const getISTDate = (timestamp) => {
  if (!timestamp) return new Date();
  const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return isNaN(date.getTime()) ? new Date() : new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

export const processTrade = (t, globalR = 1250) => {
  // SAFER PARSING: Prevents NaN crashes entirely
  const entry = parseFloat(t.entry) || 0;
  const exit = parseFloat(t.exitPrice || t.cmp || t.entry) || 0;
  const sl = parseFloat(t.initialSl || t.sl) || 0;
  const qty = parseFloat(t.quantity) || 0;
  const fees = parseFloat(t.fees) || 0; 
  const isShort = t.type === 'SHORT';

  const riskDist = Math.abs(entry - sl);
  const riskAmount = (riskDist * qty) || parseFloat(t.riskAmount) || parseFloat(globalR) || 1250;

  let rewardDist = isShort ? (entry - exit) : (exit - entry);
  let rMultiple = riskDist > 0 ? rewardDist / riskDist : 0;

  let grossPnl = rewardDist * qty;
  let netPnl = grossPnl - fees;

  return { ...t, riskDist, riskAmount, rMultiple, netPnl, grossPnl, isShort, dateObj: getISTDate(t.date) };
};

export const calculateMetrics = (rawTrades, globalR = 1250) => {
  if (!rawTrades || rawTrades.length === 0) return defaultMetrics();

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

  const tor = open.reduce((s, t) => {
    const slDist = Math.abs((parseFloat(t.entry)||0) - (parseFloat(t.sl)||0));
    const currentRisk = slDist * (parseFloat(t.quantity)||0);
    return s + (currentRisk / validR);
  }, 0);

  return {
    processedTrades: trades, total, winners: winners.length, losers: losers.length, be: be.length, open: open.length,
    winRate, avgRGain, avgRLoss, avgRBe, arr, expectancy, totalR, tor, 
    intensity, netPnl: totalNetPnl, avgGainMoney, avgLossMoney, avgBeMoney, totalProfit: totalNetPnl
  };
};

const defaultMetrics = () => ({
  processedTrades:[], total: 0, winners: 0, losers: 0, be: 0, open: 0,
  winRate: 0, avgRGain: 0, avgRLoss: 0, avgRBe: 0, arr: 0, expectancy: 0, totalR: 0, tor: 0, 
  intensity: 0, netPnl: 0, avgGainMoney: 0, avgLossMoney: 0, avgBeMoney: 0, totalProfit: 0
});

export const calculatePositionsMetrics = (trades) => {
  const open = trades.filter(t => t.status === 'Open');
  const totalExposure = open.reduce((s, t) => s + ((parseFloat(t.entry)||0) * (parseFloat(t.quantity)||0)), 0);
  const totalOpenRisk = open.reduce((s, t) => s + (Math.abs((parseFloat(t.entry)||0) - (parseFloat(t.sl)||0)) * (parseFloat(t.quantity)||0)), 0);
  const totalUnrealized = open.reduce((s, t) => {
    const entry = parseFloat(t.entry)||0;
    const cmp = parseFloat(t.cmp) || entry;
    const qty = parseFloat(t.quantity)||0;
    return s + (t.type === 'SHORT' ? (entry - cmp) * qty : (cmp - entry) * qty);
  }, 0);
  return { totalExposure, totalOpenRisk, totalUnrealized };
};

export const calculateLiveR = (trade, cmp) => {
  const entry = parseFloat(trade.entry)||0;
  const currentPrice = parseFloat(cmp)||entry;
  const initialSl = parseFloat(trade.initialSl)||0;
  const slDistance = Math.abs(entry - initialSl);
  if (slDistance === 0) return 0;
  return trade.type === 'SHORT' ? (entry - currentPrice) / slDistance : (currentPrice - entry) / slDistance;
};

export const groupTrades = (trades, type) => {
  const groups = {};
  trades.forEach(t => {
    if(!t.date) return; // Prevent crash on missing dates
    const d = t.date?.seconds ? new Date(t.date.seconds * 1000) : new Date(t.date);
    if(isNaN(d.getTime())) return; // Prevent crash on invalid dates
    
    let key = type === 'Monthly' ? d.toLocaleString('en-IN', { month: 'short', year: 'numeric' }) 
            : type === 'Yearly' ? d.getFullYear().toString() 
            : `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  return groups;
};

export const calculateDays = (entryDate, exitDate) => {
  if(!entryDate) return 0;
  const start = entryDate?.seconds ? new Date(entryDate.seconds * 1000) : new Date(entryDate);
  const end = exitDate ? new Date(exitDate) : new Date();
  if(isNaN(start.getTime())) return 0;
  return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
};