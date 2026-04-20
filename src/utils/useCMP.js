import { useEffect, useState } from "react";

export default function useCMP(symbol) {
  const [cmp, setCmp] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchCMP = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/cmp?symbol=${symbol}.NS`
        );
        const data = await res.json();
        setCmp(data.cmp);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCMP();

    const interval = setInterval(fetchCMP, 5000);

    return () => clearInterval(interval);
  }, [symbol]);

  return cmp;
}