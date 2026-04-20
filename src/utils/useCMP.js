import { useEffect, useState } from "react";

export default function useCMP(symbol) {
  const [cmp, setCmp] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    const cleanSymbol = symbol.replace(/\s+/g, "").toUpperCase();

    let isMounted = true; // ✅ prevent memory leak

    const fetchCMP = async () => {
      try {
        const res = await fetch(
          `https://champion-journal.onrender.com/api/cmp?symbol=${cleanSymbol}`
        );

        // ✅ handle non-200 safely
        if (!res.ok) {
          console.warn("CMP API Error:", res.status);
          return;
        }

        const data = await res.json();

        // ✅ SAFE CHECK (main fix)
        if (isMounted) {
          if (data && data.cmp !== undefined && data.cmp !== null) {
            setCmp(Number(data.cmp));
          } else {
            // fallback (important)
            setCmp(null);
          }
        }

      } catch (err) {
        console.error("CMP Fetch Error:", err);

        // ✅ NEVER CRASH UI
        if (isMounted) {
          setCmp(null);
        }
      }
    };

    fetchCMP();

    const interval = setInterval(fetchCMP, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbol]);

  return cmp;
}