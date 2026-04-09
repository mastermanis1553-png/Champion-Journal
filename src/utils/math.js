// ============================================
// 🔥 CORE TRADE CALCULATION ENGINE (SINGLE SOURCE OF TRUTH)
// ============================================
export const getTradeMetrics = (t) => {
  const entry = parseFloat(t.entry);
  const sl = parseFloat(t.sl);
  const exit = parseFloat(t.exit || t.cmp);
  const qty = parseFloat(t.quantity);

  if (!entry || !sl || !qty || entry === sl) return null;

  const riskPerShare = Math.abs(entry - sl);
  const risk = riskPerShare * qty;

  const move = exit - entry; // works for long (short adjust later if needed)
  const r = move / riskPerShare;
  const pnl = r * risk;

  return { risk, r, pnl };
};

// ============================================
// 📊 MAIN METRICS CALCULATION
// ============================================
export const calculateMetrics = (trades) => {
  const closed = trades.filter(t => t.status !== 'Open');
  const open = trades.filter(t => t.status === 'Open');

  let totalR = 0;
  let netPnl = 0;

  const enrichedTrades = closed.map(t => {
    const metrics = getTradeMetrics(t);
    if (!metrics) return null;

    totalR += metrics.r;
    netPnl += metrics.pnl;

    return { ...t, ...metrics };
  }).filter(Boolean);

  const total = enrichedTrades.length;

  const winners = enrichedTrades.filter(t => t.r > 0.1);
  const losers = enrichedTrades.filter(t => t.r < -0.1);
  const be = enrichedTrades.filter(t => Math.abs(t.r) <= 0.1);

  const winRate = total > 0 ? winners.length / total : 0;
  const lossRate = total > 0 ? losers.length / total : 0;

  const avgRGain = winners.length
    ? winners.reduce((s, t) => s + t.r, 0) / winners.length
    : 0;

  const avgRLoss = losers.length
    ? Math.abs(losers.reduce((s, t) => s + t.r, 0) / losers.length)
    : 0;

  const avgRBe = be.length
    ? be.reduce((s, t) => s + t.r, 0) / be.length
    : 0;

  const arr = avgRLoss > 0 ? avgRGain / avgRLoss : 0;

  const expectancy = (winRate * avgRGain) - (lossRate * avgRLoss);

  // 🔥 Correct intensity (R based)
  const intensity = expectancy * total;

  // 💰 MONEY AVERAGES (REAL)
  const avgGainMoney = winners.length
    ? winners.reduce((s, t) => s + t.pnl, 0) / winners.length
    : 0;

  const avgLossMoney = losers.length
    ? Math.abs(losers.reduce((s, t) => s + t.pnl, 0) / losers.length)
    : 0;

  const avgBeMoney = be.length
    ? be.reduce((s, t) => s + t.pnl, 0) / be.length
    : 0;

  // 🔥 TOTAL OPEN RISK (TOR)
  const tor = open.reduce((s, t) => {
    const metrics = getTradeMetrics(t);
    return metrics ? s + metrics.risk : s;
  }, 0);

  return {
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
    intensity,

    netPnl,
    totalProfit: netPnl,

    avgGainMoney,
    avgLossMoney,
    avgBeMoney,

    tor
  };
};

// ============================================
// 📊 POSITIONS METRICS
// ============================================
export const calculatePositionsMetrics = (trades) => {
  const open = trades.filter(t => t.status === 'Open');

  const totalExposure = open.reduce((s, t) => s + (t.entry * t.quantity), 0);

  const totalOpenRisk = open.reduce((s, t) => {
    const m = getTradeMetrics(t);
    return m ? s + m.risk : s;
  }, 0);

  const totalUnrealized = open.reduce((s, t) => {
    const m = getTradeMetrics(t);
    return m ? s + m.pnl : s;
  }, 0);

  return { totalExposure, totalOpenRisk, totalUnrealized };
};

// ============================================
// 📈 LIVE R CALCULATION
// ============================================
export const calculateLiveR = (trade, cmp) => {
  const entry = parseFloat(trade.entry);
  const sl = parseFloat(trade.sl);
  const price = parseFloat(cmp);

  if (!entry || !sl || !price || entry === sl) return 0;

  const riskPerShare = Math.abs(entry - sl);
  return (price - entry) / riskPerShare;
};

// ============================================
// 📅 DAYS CALCULATION (SAFE)
// ============================================
export const calculateDays = (entryDate, exitDate) => {
  const start = new Date(entryDate);
  const end = exitDate ? new Date(exitDate) : new Date();

  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ============================================
// 📊 GROUPING (UNCHANGED BUT SAFE)
// ============================================
export const groupTrades = (trades, type) => {
  const groups = {};

  trades.forEach(t => {
    const d = t.date?.seconds
      ? new Date(t.date.seconds * 1000)
      : new Date(t.date);

    let key;

    if (type === 'Monthly') {
      key = d.toLocaleString('default', { month: 'short' }) + " " + d.getFullYear();
    } else if (type === 'Yearly') {
      key = d.getFullYear().toString();
    } else {
      key = `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  return groups;
};