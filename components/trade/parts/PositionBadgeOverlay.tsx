"use client";

import { usePriceStream } from "@/hooks/usePriceStream";
import { useEffect, useMemo, useState } from "react";
import ClosePositionDialog from "./ClosePositionDialog";

// 🔒 server model-এর সাথে মিলিয়ে নিন
type Pos = {
  _id: string;
  symbol: string;
  side: "buy" | "sell";
  lots: number; // ✅ volume নয়, lots
  entryPrice: number;
  contractSize?: number; // crypto=1, XAU=100...
  status: "open" | "closed";
};

export default function PositionBadgeOverlay({
  symbol,
  accountCurrency = "USD",
}: {
  symbol: string;
  accountCurrency?: string;
}) {
  const { price } = usePriceStream(symbol);
  const [pos, setPos] = useState<Pos | null>(null);
  const [showClose, setShowClose] = useState(false);

  // listen global events from place/close APIs
  useEffect(() => {
    const onOpen = (e: any) => {
      const p: Pos = e.detail?.position;
      if (p && p.symbol === symbol && p.status === "open") setPos(p);
    };
    const onClosed = (e: any) => {
      const id = e.detail?.id;
      setPos((prev) => (prev && prev._id === id ? null : prev));
    };
    addEventListener("position:opened", onOpen as any);
    addEventListener("position:closed", onClosed as any);
    return () => {
      removeEventListener("position:opened", onOpen as any);
      removeEventListener("position:closed", onClosed as any);
    };
  }, [symbol]);

  // safe helpers
  const lotsText = typeof pos?.lots === "number" ? pos!.lots.toFixed(2) : "-";
  const execPx = useMemo(() => {
    if (!pos || !price) return NaN;
    // closeable price (buy→bid, sell→ask)
    const px = pos.side === "buy" ? price.bid : price.ask;
    return typeof px === "number" && isFinite(px) ? px : NaN;
  }, [pos, price]);

  const pnl = useMemo(() => {
    if (!pos || !isFinite(execPx)) return 0;
    const cs = pos.contractSize ?? (pos.symbol.includes("XAU") ? 100 : 1); // crypto default 1
    const diff =
      pos.side === "buy" ? execPx - pos.entryPrice : pos.entryPrice - execPx;
    const value = diff * cs * pos.lots;
    return isFinite(value) ? value : 0;
  }, [pos, execPx]);

  // no open position → nothing to draw
  if (!pos) return null;

  return (
    <>
      {/* Top-left live PnL pill */}
      <div className="absolute left-4 top-3 z-10">
        <div
          className={`px-3 py-1.5 rounded-lg font-medium ${
            pnl >= 0
              ? "bg-green-600/20 text-green-400"
              : "bg-red-600/20 text-red-400"
          }`}
        >
          {(pnl >= 0 ? "+" : "") + pnl.toFixed(2)} {accountCurrency}
        </div>
      </div>

      {/* Entry badge + close button (Exness style) */}
      <div className="absolute left-4 top-14 z-10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-sm">
            {lotsText}
          </span>
          <span
            className={`px-2 py-1 rounded-md text-sm ${
              pnl >= 0
                ? "bg-green-600/20 text-green-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {(pnl >= 0 ? "+" : "") + pnl.toFixed(2)} {accountCurrency}
          </span>
          <button
            onClick={() => setShowClose(true)}
            className="ml-2 px-2 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {showClose && (
        <ClosePositionDialog
          position={{
            _id: pos._id,
            symbol: pos.symbol,
            side: pos.side,
            volume: pos.lots, // dialog props নাম volume ছিল
            entryPrice: pos.entryPrice,
          }}
          lastPrice={price?.mid ?? pos.entryPrice}
          onDone={() => setShowClose(false)}
        />
      )}
    </>
  );
}
