export default async function handler(req, res) {
  try {
    const { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol required" });
    }

    const cleanSymbol = symbol.replace(/\s+/g, "").toUpperCase();

    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${cleanSymbol}.NS`
    );

    const data = await response.json();

    const cmp =
      data?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;

    return res.status(200).json({ cmp });

  } catch (err) {
    return res.status(200).json({ cmp: null });
  }
}