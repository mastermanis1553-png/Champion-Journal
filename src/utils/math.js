// ============================================
// 🔥 CORE CALCULATION ENGINE (SINGLE SOURCE OF TRUTH)
// ============================================

/**
 * Get real-time trade metrics
 * ALWAYS calculate dynamically - never use stored values
 * 
 * @param {Object} trade - Trade object
 * @returns {Object} { risk (₹), r (R multiple), pnl (₹) } or null if invalid
 */
export const getTradeMetrics = (trade) => {
  // Parse values safely
  const entry = parseFloat(trade.entry);
  const sl = parseFloat(trade.sl);
  const quantity = parseFloat(trade.quantity);
  
  // Get current price (CMP for open, exit for closed)
  const currentPrice = parseFloat(trade.status === 'Open' 
    ? (trade.cmp || trade.entry)
    : (trade.exitPrice || trade.exit || trade.cmp || trade.entry)
  );

  // Validation
  if (!entry || !sl || !quantity || entry === sl || quantity <= 0) {
    return null;
  }

  // Calculate risk per share
  const riskPerShare = Math.abs(entry - sl);
  
  // Total risk in rupees
  const totalRiskInRupees = riskPerShare * quantity;

  // Price movement
  const priceMove = currentPrice - entry;

  // R-Multiple (how many risk units earned/lost)
  const rMultiple = priceMove / riskPerShare;

  // Profit/Loss in rupees
  const profitLoss = priceMove * quantity;

  return {
    risk: totalRiskInRupees,        // Total risk in ₹
    r: rMultiple,                    // R earned/lost
    pnl: profitLoss                  // P&L in ₹
  };
};

// ============================================
// 📊 DASHBOARD METRICS (CLOSED TRADES ONLY)
// ============================================

/**
 * Calculate all dashboard metrics
 * Based on CLOSED trades only
 * Includes real-time open trade metrics in net profit
 */
export const calculateMetrics = (trades) => {
  // Separate closed and open trades
  const closedTrades = trades.filter(t => t.status !== 'Open');
  const openTrades = trades.filter(t => t.status === 'Open');

  // ============================================
  // CLOSED TRADES ANALYSIS
  // ============================================
  
  const enrichedClosed = closedTrades
    .map(t => {
      const metrics = getTradeMetrics(t);
      return metrics ? { ...t, ...metrics } : null;
    })
    .filter(Boolean);

  const totalClosed = enrichedClosed.length;

  // Separate winners, losers, breakeven
  const winners = enrichedClosed.filter(t => t.r > 0.1);
  const losers = enrichedClosed.filter(t => t.r < -0.1);
  const breakEven = enrichedClosed.filter(t => Math.abs(t.r) <= 0.1);

  // Win rate (closed trades only)
  const winRate = totalClosed > 0 ? winners.length / totalClosed : 0;
  const lossRate = totalClosed > 0 ? losers.length / totalClosed : 0;
  const beRate = totalClosed > 0 ? breakEven.length / totalClosed : 0;

  // Average R per trade
  const avgRGain = winners.length > 0
    ? winners.reduce((sum, t) => sum + t.r, 0) / winners.length
    : 0;

  const avgRLoss = losers.length > 0
    ? Math.abs(losers.reduce((sum, t) => sum + t.r, 0) / losers.length)
    : 0;

  const avgRBe = breakEven.length > 0
    ? breakEven.reduce((sum, t) => sum + t.r, 0) / breakEven.length
    : 0;

  // Risk-Reward Ratio
  const rrRatio = avgRLoss > 0 ? avgRGain / avgRLoss : 0;

  // Expectancy (R-based)
  const expectancy = (winRate * avgRGain) - (lossRate * avgRLoss);

  // Total R from closed trades
  const totalRFromClosed = enrichedClosed.reduce((sum, t) => sum + t.r, 0);

  // 🔥 INTENSITY (R-BASED ONLY)
  // Formula: Expectancy × Number of Closed Trades
  // Result is in R, NOT in rupees
  const intensity = expectancy * totalClosed;

  // Average Money per trade
  const avgMoneyGain = winners.length > 0
    ? winners.reduce((sum, t) => sum + t.pnl, 0) / winners.length
    : 0;

  const avgMoneyLoss = losers.length > 0
    ? Math.abs(losers.reduce((sum, t) => sum + t.pnl, 0) / losers.length)
    : 0;

  const avgMoneyBe = breakEven.length > 0
    ? breakEven.reduce((sum, t) => sum + t.pnl, 0) / breakEven.length
    : 0;

  // Total P&L from closed trades
  const closedNetPnl = enrichedClosed.reduce((sum, t) => sum + t.pnl, 0);

  // ============================================
  // OPEN TRADES ANALYSIS (REAL-TIME)
  // ============================================

  const enrichedOpen = openTrades
    .map(t => {
      const metrics = getTradeMetrics(t);
      return metrics ? { ...t, ...metrics } : null;
    })
    .filter(Boolean);

  // Total unrealized P&L from open trades
  const unrealizedPnl = enrichedOpen.reduce((sum, t) => sum + t.pnl, 0);

  // 🔥 TOTAL OPEN RISK (TOR)
  // Formula: Sum of (|entry - sl| × quantity) for all open trades
  // Then convert to R by dividing by 1R amount (from settings)
  // Result is in ₹ but will be converted to R in display
  const torInRupees = enrichedOpen.reduce((sum, t) => sum + t.risk, 0);

  // Total unrealized R from open trades
  const totalRFromOpen = enrichedOpen.reduce((sum, t) => sum + t.r, 0);

  // ============================================
  // COMBINED METRICS
  // ============================================

  // Net P&L includes both closed + unrealized open
  const netPnl = closedNetPnl + unrealizedPnl;

  // Total R includes both closed + unrealized open
  const totalR = totalRFromClosed + totalRFromOpen;

  return {
    // Closed trades count
    total: totalClosed,
    winners: winners.length,
    losers: losers.length,
    be: breakEven.length,
    open: openTrades.length,

    // Win rates (closed only)
    winRate,
    lossRate,
    beRate,

    // R metrics (closed only)
    avgRGain,
    avgRLoss,
    avgRBe,
    rrRatio,
    expectancy,
    totalRFromClosed,

    // 🔥 INTENSITY (R-BASED)
    intensity,

    // Money metrics (closed only)
    avgMoneyGain,
    avgMoneyLoss,
    avgMoneyBe,
    closedNetPnl,

    // Real-time metrics (includes open)
    unrealizedPnl,
    netPnl,           // Closed + Open P&L in ₹
    totalR,           // Closed + Open R earned
    totalRFromOpen,   // Open trades R only

    // Risk metrics
    torInRupees,      // Total open risk in ₹

    // Deprecated (kept for backward compatibility)
    totalProfit: netPnl,
    avgGainMoney: avgMoneyGain,
    avgLossMoney: avgMoneyLoss,
    avgBeMoney: avgMoneyBe,
    arr: rrRatio
  };
};

// ============================================
// 💰 POSITIONS PAGE METRICS
// ============================================

/**
 * Calculate metrics for open positions only
 * All values are REAL-TIME based on current CMP
 */
export const calculatePositionsMetrics = (trades) => {
  const openTrades = trades.filter(t => t.status === 'Open');

  // Total capital deployed
  const totalExposure = openTrades.reduce((sum, t) => {
    const entry = parseFloat(t.entry);
    const qty = parseFloat(t.quantity);
    return sum + (entry * qty);
  }, 0);

  // Total risk in rupees
  const totalOpenRiskRupees = openTrades.reduce((sum, t) => {
    const metrics = getTradeMetrics(t);
    return metrics ? sum + metrics.risk : sum;
  }, 0);

  // Total unrealized P&L (real-time)
  const totalUnrealizedPnl = openTrades.reduce((sum, t) => {
    const metrics = getTradeMetrics(t);
    return metrics ? sum + metrics.pnl : sum;
  }, 0);

  // Total unrealized R
  const totalUnrealizedR = openTrades.reduce((sum, t) => {
    const metrics = getTradeMetrics(t);
    return metrics ? sum + metrics.r : sum;
  }, 0);

  return {
    totalExposure,            // ₹ deployed
    totalOpenRiskRupees,      // ₹ at risk
    totalUnrealizedPnl,       // ₹ unrealized gain/loss
    totalUnrealizedR,         // R unrealized
    
    // For backward compatibility
    totalOpenRisk: totalOpenRiskRupees,
    totalUnrealized: totalUnrealizedPnl
  };
};

// ============================================
// 🎯 LIVE R CALCULATION
// ============================================

/**
 * Get live R for a single trade at current CMP
 */
export const calculateLiveR = (trade, cmp) => {
  const entry = parseFloat(trade.entry);
  const sl = parseFloat(trade.sl);
  const currentPrice = parseFloat(cmp || trade.cmp || trade.entry);

  if (!entry || !sl || !currentPrice || entry === sl) {
    return 0;
  }

  const riskPerShare = Math.abs(entry - sl);
  return (currentPrice - entry) / riskPerShare;
};

// ============================================
// 📅 DAYS CALCULATION
// ============================================

/**
 * Calculate days between entry and exit
 */
export const calculateDays = (entryDate, exitDate) => {
  const start = new Date(
    entryDate?.seconds ? entryDate.seconds * 1000 : entryDate
  );
  const end = exitDate 
    ? new Date(exitDate?.seconds ? exitDate.seconds * 1000 : exitDate)
    : new Date();

  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ============================================
// 📊 GROUP TRADES BY PERIOD
// ============================================

/**
 * Group trades by Monthly, Quarterly, or Yearly
 */
export const groupTrades = (trades, groupType = 'Quarterly') => {
  const groups = {};

  trades.forEach(trade => {
    // Parse date safely
    const tradeDate = trade.date?.seconds
      ? new Date(trade.date.seconds * 1000)
      : new Date(trade.date);

    let groupKey;

    if (groupType === 'Monthly') {
      const month = tradeDate.toLocaleString('default', { month: 'short' });
      const year = tradeDate.getFullYear();
      groupKey = `${month} ${year}`;
    } else if (groupType === 'Yearly') {
      groupKey = tradeDate.getFullYear().toString();
    } else {
      // Quarterly (default)
      const quarter = Math.floor(tradeDate.getMonth() / 3) + 1;
      const year = tradeDate.getFullYear();
      groupKey = `Q${quarter} ${year}`;
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(trade);
  });

  return groups;
};

// ============================================
// 🔄 CONVERT TOR TO R (FOR DISPLAY)
// ============================================

/**
 * Convert total open risk in rupees to R units
 * @param {number} torInRupees - Total open risk in ₹
 * @param {number} baseRiskAmount - 1R amount (from settings)
 * @returns {number} TOR in R units
 */
export const convertTorToR = (torInRupees, baseRiskAmount) => {
  if (!baseRiskAmount || baseRiskAmount <= 0) return 0;
  return torInRupees / baseRiskAmount;
};

// ============================================
// ✅ VALIDATE TRADE DATA
// ============================================

/**
 * Validate trade before creating/updating
 */
export const validateTrade = (trade) => {
  const entry = parseFloat(trade.entry);
  const sl = parseFloat(trade.sl);
  const qty = parseFloat(trade.quantity);

  const errors = [];

  if (!entry || entry <= 0) errors.push('Invalid entry price');
  if (!sl || sl <= 0) errors.push('Invalid stop loss');
  if (entry === sl) errors.push('Entry and SL cannot be the same');
  if (!qty || qty <= 0) errors.push('Quantity must be greater than 0');

  return {
    valid: errors.length === 0,
    errors
  };
};