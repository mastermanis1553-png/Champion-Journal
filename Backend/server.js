import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";

const app = express();
app.use(cors());

app.get("/api/cmp", async (req, res) => {
  try {
    let { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol required" });
    }

    // ✅ CLEAN + CONTROL SYMBOL HERE ONLY
    const cleanSymbol =
      symbol.replace(/\s+/g, "").toUpperCase() + ".NS";

    console.log("Fetching:", cleanSymbol);

    let data;

    // ✅ TRY NORMAL QUOTE
    try {
      data = await yahooFinance.quote(cleanSymbol);
    } catch (err) {
      console.log("Quote failed, trying fallback...");
      data = await yahooFinance.quoteSummary(cleanSymbol, {
        modules: ["price"]
      });
    }

    // ✅ SAFE CMP EXTRACTION
    const cmp =
      data?.regularMarketPrice ||
      data?.price?.regularMarketPrice;

    if (!cmp) {
      return res.status(404).json({ error: "Invalid symbol" });
    }

    // ✅ ONLY ONE RESPONSE (important fix)
    return res.json({ cmp });

  } catch (err) {
    console.error("Backend Error:", err.message);

    return res.status(500).json({
      error: "Failed to fetch CMP"
    });
  }
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);