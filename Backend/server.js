import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";

const app = express();
app.use(cors());

app.get("/api/cmp", async (req, res) => {
  try {
    const { symbol } = req.query;

    const data = await yahooFinance.quote(symbol);

    res.json({
      cmp: data.regularMarketPrice
    });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

app.listen(5000, () => console.log("Server running"));