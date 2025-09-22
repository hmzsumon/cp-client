/* ──────────────────────────────────────────────────────────────────────────
   usePriceStream — tries WS ws://.../ws/prices?symbol=; fallback: random tick
────────────────────────────────────────────────────────────────────────── */
"use client";

import { useEffect, useRef, useState } from "react";

type Tick = { bid: number; ask: number; mid: number };

export function usePriceStream(symbol: string) {
  const [price, setPrice] = useState<Tick | null>(null);
  const timer = useRef<any>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(
        `${
          process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000"
        }/ws/prices?symbol=${symbol}`
      );
      ws.onmessage = (ev) => {
        const t = JSON.parse(ev.data) as Tick;
        setPrice(t);
      };
      ws.onerror = () => {
        /* fall back below */
      };
    } catch {}

    // fallback — random walk
    if (!ws || ws.readyState !== 1) {
      clearInterval(timer.current);
      let p = seedPrice(symbol);
      timer.current = setInterval(() => {
        const drift =
          (Math.random() - 0.5) * (symbol.includes("USD") ? 0.2 : 1);
        p = Math.max(0.0001, p + drift);
        setPrice({ mid: p, bid: p - 0.05, ask: p + 0.05 });
      }, 900);
    }

    return () => {
      ws?.close();
      clearInterval(timer.current);
    };
  }, [symbol]);

  return { price };
}

function seedPrice(sym: string) {
  if (sym === "XAUUSD") return 3688;
  if (sym === "EURUSD") return 1.18;
  if (sym === "BTCUSD") return 115000;
  return 100;
}
