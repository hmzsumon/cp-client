// hooks/useMiniTickerMap.ts
"use client";

import { useEffect, useState } from "react";

interface MiniTickerRaw {
  s: string; // symbol
  c: string; // last price
}

export function useMiniTickerMap(symbols: string[]): Record<string, number> {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!symbols.length) return;

    const wanted = new Set(symbols.map((s) => s.toUpperCase()));

    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/!miniTicker@arr"
    );

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const arr = JSON.parse(event.data) as MiniTickerRaw[];
        if (!Array.isArray(arr)) return;

        setPrices((prev) => {
          const next = { ...prev };
          for (const t of arr) {
            const sym = t.s.toUpperCase();
            if (!wanted.has(sym)) continue;

            const last = Number(t.c);
            if (!Number.isNaN(last)) {
              next[sym] = last;
            }
          }
          return next;
        });
      } catch (e) {
        console.error("miniTicker wallet parse error", e);
      }
    };

    return () => {
      ws.close();
    };
  }, [symbols.join(",")]);

  return prices;
}
