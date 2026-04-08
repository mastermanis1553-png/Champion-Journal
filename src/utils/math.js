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
  const avgRLoss = losers.length > 0 ? Math.abs(losers.reduce((s, t) => s + t.rMultiple, 0) / losers.length) : 0;
  const avgRBe = be.length > 0 ? be.reduce((s, t) => s + t.rMultiple, 0) / be.length : -0.01; // Default slightly negative for BE costs

  const arr = avgRLoss > 0 ? avgRGain / avgRLoss : 0;
  
  // Formulas specified by you
  const expectancy = (winRate * avgRGain) - (lossRate * avgRLoss);
  const intensity = expectancy * total * globalR;
  const totalR = closed.reduce((s, t) => s + t.rMultiple, 0);

  // Money based averages for Summary
  const avgGainMoney = avgRGain * globalR;
  const avgLossMoney = avgRLoss * globalR;
  const avgBeMoney = avgRBe * globalR;
  
  // Profit calculations
  const totalProfit = totalR * globalR;

  const tor = open.reduce((s, t) => {
    const slDist = Math.abs(t.entry - t.sl);
    const currentRisk = slDist * t.quantity;
    return s + (currentRisk / (t.riskAmount || globalR));
  }, 0);

  return {
    total, winners: winners.length, losers: losers.length, be: be.length, open: open.length,
    winRate, avgRGain, avgRLoss, avgRBe, arr, expectancy, totalR, tor, intensity,
    avgGainMoney, avgLossMoney, avgBeMoney, totalProfit
  };
};

export const calculatePositionsMetrics = (trades) => {
  const open = trades.filter(t => t.status === 'Open');
  const totalExposure = open.reduce((s, t) => s + (t.entry * t.quantity), 0);
  const totalOpenRisk = open.reduce((s, t) => s + (Math.abs(t.entry - t.sl) * t.quantity), 0);
  const totalUnrealized = open.reduce((s, t) => {
    const cmp = t.cmp || t.entry;
    return s + ((cmp - t.entry) * t.quantity);
  }, 0);
  return { totalExposure, totalOpenRisk, totalUnrealized };
};

export const calculateLiveR = (trade, cmp) => {
  if (!cmp || !trade.entry || !trade.initialSl) return 0;
  const slDistance = Math.abs(trade.entry - trade.initialSl);
  if (slDistance === 0) return 0;
  return (cmp - trade.entry) / slDistance;
};

export const calculateDays = (entryDate, exitDate) => {
  const end = exitDate ? new Date(exitDate) : new Date();
  const diffTime = Math.abs(end - entryDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

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