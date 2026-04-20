import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";

const app = express();
app.use(cors());

const PORT = 5000;

app.get("/api/cmp", async (req, res) => {
  try {
    const { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol required" });
    }

    const data = await yahooFinance.quote(symbol);

    res.json({
      symbol: data.symbol,
      cmp: data.regularMarketPrice,
      change: data.regularMarketChange,
    });

  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

app.listen(PORT, () => console.log("Server running on 5000"));