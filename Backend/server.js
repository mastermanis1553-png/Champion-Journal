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

    // ✅ DIRECT YAHOO API (stable)
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${cleanSymbol}.NS`
    );

    const data = await response.json();

    const cmp =
      data?.chart?.result?.[0]?.meta?.regularMarketPrice;

    if (!cmp) {
      return res.status(404).json({ error: "Invalid symbol" });
    }

    res.json({ cmp });

  } catch (err) {
    console.error("Backend Error:", err.message);

    res.status(500).json({
      error: "Failed to fetch CMP"
    });
  }
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);