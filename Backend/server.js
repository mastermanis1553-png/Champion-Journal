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

    const cleanSymbol = symbol.replace(/\s+/g, "").toUpperCase();

    // ✅ NSE symbol
    const fullSymbol = `${cleanSymbol}.NS`;

    console.log("Fetching CMP:", fullSymbol);

    // ✅ STABLE METHOD
    const quote = await yahooFinance.quote(fullSymbol);

    if (!quote || !quote.regularMarketPrice) {
      return res.json({
        cmp: null,
        error: "No data found"
      });
    }

    res.json({
      cmp: quote.regularMarketPrice
    });

  } catch (err) {
    console.error("CMP ERROR:", err.message);

    res.json({
      cmp: null,
      error: "Fetch failed"
    });
  }
});

// ✅ PORT FIX (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);