import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/cmp", async (req, res) => {
  try {
    let { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol required" });
    }

    const cleanSymbol = symbol.replace(/\s+/g, "").toUpperCase();

    console.log("Fetching:", cleanSymbol);

    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${cleanSymbol}.NS`
    );

    const data = await response.json();

    // ✅ SAFE CHECK
    const result = data?.chart?.result;

    if (!result || !result[0]) {
      return res.status(200).json({
        cmp: null,
        error: "Invalid symbol or no data"
      });
    }

    const cmp = result[0]?.meta?.regularMarketPrice;

    if (!cmp) {
      return res.status(200).json({
        cmp: null,
        error: "CMP not found"
      });
    }

    res.json({ cmp });

  } catch (err) {
    console.error("Backend Error:", err.message);

    // ✅ NEVER CRASH
    res.status(200).json({
      cmp: null,
      error: "Fallback error"
    });
  }
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);