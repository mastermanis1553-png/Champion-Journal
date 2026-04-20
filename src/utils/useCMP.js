import { useEffect, useState } from "react";

export default function useCMP(symbol) {
  const [cmp, setCmp] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    // ✅ CLEAN SYMBOL (main fix)
    const cleanSymbol = symbol.replace(/\s+/g, "").toUpperCase();

    const fetchCMP = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/cmp?symbol=${cleanSymbol}`
        );

        const data = await res.json();

        if (data?.cmp) {
          setCmp(data.cmp);
        }
      } catch (err) {
        console.error("CMP Fetch Error:", err);
      }
    };

    fetchCMP();

    const interval = setInterval(fetchCMP, 5000);

    return () => clearInterval(interval);
  }, [symbol]);

  return cmp;
}