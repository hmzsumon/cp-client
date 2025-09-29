/* ──────────────────────────────────────────────────────────────────────────
   LiveChart — Exness-like lightweight-charts (Binance data)
────────────────────────────────────────────────────────────────────────── */
"use client";

import {
  BinanceKlineInterval,
  useBinanceStream,
} from "@/hooks/useBinanceStream";
import {
  CandlestickData,
  ColorType,
  createChart,
  IChartApi,
  Time,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

type Props = {
  symbol: string; // e.g. "BTCUSDT"
  interval?: BinanceKlineInterval; // "1m" | "3m" | ...
  limit?: number; // initial bars (default 800)
};

export default function LiveChart({
  symbol,
  interval = "1m",
  limit = 800,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ReturnType<
    IChartApi["addCandlestickSeries"]
  > | null>(null);

  // ---------- Binance WS streams ----------
  const klineStream = `kline_${interval}` as const;
  const { data: kline } = useBinanceStream(symbol, klineStream);
  const { data: book } = useBinanceStream(symbol, "bookTicker");

  // ---------- mount / rebuild on symbol or interval ----------
  useEffect(() => {
    if (!wrap.current) return;

    const chart = createChart(wrap.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0b0e11" },
        textColor: "#cbd5e1",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.12, bottom: 0.2 },
        autoScale: true,
      },
      timeScale: {
        rightOffset: 6,
        barSpacing: 12,
        minBarSpacing: 6,
        lockVisibleTimeRangeOnResize: true,
        fixLeftEdge: true,
        borderVisible: false,
      },
      crosshair: { mode: 0 },
    });

    const s = chart.addCandlestickSeries({
      upColor: "#1ea97c",
      downColor: "#ef4444",
      wickUpColor: "#1ea97c",
      wickDownColor: "#ef4444",
      borderUpColor: "#158f6a",
      borderDownColor: "#dc2f2f",
      borderVisible: true,
      priceFormat: {
        type: "price",
        precision: priceDecimals(symbol),
        minMove: minMove(symbol),
      },
      lastValueVisible: true,
      priceLineVisible: true,
    });

    chartRef.current = chart;
    seriesRef.current = s;

    const resize = () => {
      if (!wrap.current) return;
      chart.applyOptions({
        width: wrap.current.clientWidth,
        height: wrap.current.clientHeight,
      });
    };
    resize();
    addEventListener("resize", resize);

    // ---------- initial REST fill ----------
    (async () => {
      try {
        const q = new URLSearchParams({
          symbol,
          interval,
          limit: String(limit),
        });
        const res = await fetch(`/api/crypto/klines?${q.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        const data: CandlestickData[] = (json?.data ?? []).map((k: any) => ({
          time: k.time as Time,
          open: k.open,
          high: k.high,
          low: k.low,
          close: k.close,
        }));

        s.setData(data);

        // zoom to last N bars (Exness-like)
        const show = 150;
        const total = data.length;
        const from = Math.max(0, total - show);
        const to = total + 3;
        chart.timeScale().setVisibleLogicalRange({ from, to });
      } catch {}
    })();

    return () => {
      removeEventListener("resize", resize);
      try {
        chart.remove();
      } catch {}
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [symbol, interval, limit]);

  // ---------- live update (kline) ----------
  useEffect(() => {
    if (!kline || !seriesRef.current) return;
    const k = (kline as any).k;
    if (!k) return;

    const bar: CandlestickData = {
      time: Math.floor(k.t / 1000) as Time,
      open: +k.o,
      high: +k.h,
      low: +k.l,
      close: +k.c,
    };
    seriesRef?.current?.update(bar);
  }, [kline]);

  return (
    <div className="relative h-full w-full">
      <div ref={wrap} className="absolute inset-0" />
      {/* bid / ask bubbles */}
    </div>
  );
}

/* ───────────────────────── helpers ───────────────────────── */
function priceDecimals(sym: string) {
  const s = sym.toUpperCase();
  if (s.includes("XAU") || s.includes("XAG")) return 2;
  if (/USDT$/.test(s)) {
    if (/(BONK|PEPE|SHIB|DOGE)/.test(s)) return 5;
    if (/BTC|ETH|SOL|BNB/.test(s)) return 2;
    return 3;
  }
  return 2;
}
function minMove(sym: string) {
  const p = priceDecimals(sym);
  return Number((1 / 10 ** p).toFixed(p));
}
