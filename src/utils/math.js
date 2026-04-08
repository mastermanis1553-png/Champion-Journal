// Master Math Engine for R Trades Journal

export const calculateMetrics = (trades, globalR = 1250) => {
  const closed = trades.filter(t => t.status !== 'Open');
  const open = trades.filter(t => t.status === 'Open');
  const total = closed.length;
  
  const winners = closed.filter(t => t.rMultiple > 0.1);
  const losers = closed.filter(t => t.rMultiple < -0.1);
  const be = closed.filter(t => t.rMultiple >= -0.1 && t.rMultiple <= 0.1);

  const winRate = total > 0 ? (winners.length / total) : 0;
  const lossRate = total > 0 ? (losers.length / total) : 0;

  const avgRGain = winners.length > 0 ? winners.reduce((s, t) => s + t.rMultiple, 0) / winners.length : 0;
  const avgRLoss = losers.length > 0 ? Math.abs(losers.reduce((s, t) => s + t.rMultiple, 0)) / losers.length : 0;
  
  const expectancy = (winRate * avgRGain) - (lossRate * avgRLoss);
  const intensity = expectancy * total * globalR;

  const tor = open.reduce((s, t) => {
    const rpt = parseFloat(t.riskAmount) || parseFloat(globalR);
    return s + (Math.max(0, (t.entry - t.sl) * t.quantity) / rpt);
  }, 0);

  const getMoney = (t) => t.rMultiple * (t.riskAmount || globalR);

  return {
    total, winners: winners.length, losers: losers.length, be: be.length,
    winRate, arr: avgRLoss > 0 ? avgRGain / avgRLoss : 0, expectancy, tor, intensity,
    avgGainMoney: winners.length > 0 ? winners.reduce((s, t) => s + getMoney(t), 0) / winners.length : 0,
    avgLossMoney: losers.length > 0 ? Math.abs(losers.reduce((s, t) => s + getMoney(t), 0)) / losers.length : 0,
    totalProfit: closed.reduce((s, t) => s + getMoney(t), 0),
    avgRisk: trades.length > 0 ? trades.reduce((s, t) => s + (t.riskAmount || globalR), 0) / trades.length : 0
  };
};

// Add this at the bottom of src/utils/math.js
export const calculateDays = (entryDate, exitDate) => {
  if (!exitDate) {
    const diffTime = Math.abs(new Date() - entryDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  const diffTime = Math.abs(new Date(exitDate) - entryDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateLiveR = (trade, cmp) => {
  const entry = parseFloat(trade.entry);
  const initialSl = parseFloat(trade.initialSl);
  const slDist = Math.abs(entry - initialSl);
  return slDist === 0 ? 0 : (parseFloat(cmp) - entry) / slDist;
};

export const groupTrades = (trades, type) => {
  const groups = {};
  trades.forEach(t => {
    const d = t.date?.seconds ? new Date(t.date.seconds * 1000) : new Date(t.date);
    let key;
    if (type === 'Monthly') key = d.toLocaleString('default', { month: 'short' }) + " " + d.getFullYear();
    else if (type === 'Yearly') key = d.getFullYear().toString();
    else key = `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  return groups;
};

export const calculatePositionsMetrics = (trades, globalR = 1250) => {
  const open = trades.filter(t => t.status === 'Open');
  const closed = trades.filter(t => t.status !== 'Open');
  const exposure = open.reduce((s, t) => s + ((t.cmp || t.entry) * t.quantity), 0);
  const openRiskMoney = open.reduce((s, t) => s + Math.max(0, (t.entry - t.sl) * t.quantity), 0);
  const unrealisedMoney = open.reduce((s, t) => s + ((t.cmp || t.entry) - t.entry) * t.quantity, 0);
  const realisedAllTime = closed.reduce((s, t) => s + (t.rMultiple * (t.riskAmount || globalR)), 0);
  return { exposure, openRiskMoney, openRiskR: openRiskMoney / globalR, unrealisedMoney, realisedAllTime };
};

