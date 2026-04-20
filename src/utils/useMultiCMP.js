import { useEffect, useState } from "react";

export default function useMultiCMP(symbols = []) {
  const [cmpMap, setCmpMap] = useState({});

  useEffect(() => {
    if (!symbols || symbols.length === 0) return;

    const cleanSymbols = [...new Set(
      symbols
        .filter(Boolean)
        .map(s => s.replace(/\s+/g, "").toUpperCase())
    )];

    let isMounted = true;

    const fetchAllCMP = async () => {
      try {
        const results = await Promise.all(
          cleanSymbols.map(async (symbol) => {
            try {
              const res = await fetch(
                `/api/cmp?symbol=${symbol}`
              );
              const data = await res.json();
              return { symbol, cmp: data?.cmp ?? null };
            } catch {
              return { symbol, cmp: null };
            }
          })
        );

        if (isMounted) {
          const map = {};
          results.forEach(r => {
            map[r.symbol] = r.cmp;
          });
          setCmpMap(map);
        }

      } catch (err) {
        console.error("Multi CMP Error:", err);
      }
    };

    fetchAllCMP();
    const interval = setInterval(fetchAllCMP, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [JSON.stringify(symbols)]);

  return cmpMap;
}