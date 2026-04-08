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

  const arr = avgRLoss > 0 ? avgRGain / avgRLoss : 0;
  const expectancy = (winRate * avgRGain) - (lossRate * avgRLoss);
  
  const totalR = closed.reduce((s, t) => s + t.rMultiple, 0);

  // FIX: Intensity is in 'R' (Expectancy * Trades). Net P&L is in 'Money'.
  const intensity = expectancy * total;
  const netPnl = totalR * globalR;

  const tor = open.reduce((s, t) => {
    const slDist = Math.abs(t.entry - t.sl);
    const currentRisk = slDist * t.quantity;
    return s + (currentRisk / (t.riskAmount || globalR));
  }, 0);

  return {
    total, winners: winners.length, losers: losers.length, be: be.length,
    winRate, avgRGain, avgRLoss, arr, expectancy, totalR, tor, intensity, netPnl
  };
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