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

    // ✅ YAHOO FINANCE LIB (stable)
    const quote = await yahooFinance.quote(`${cleanSymbol}.NS`);

    const cmp = quote?.regularMarketPrice;

    if (!cmp) {
      return res.status(200).json({
        cmp: null,
        error: "No CMP"
      });
    }

    res.json({ cmp });

  } catch (err) {
    console.error("Backend Error:", err.message);

    res.status(200).json({
      cmp: null,
      error: "Fetch failed"
    });
  }
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);