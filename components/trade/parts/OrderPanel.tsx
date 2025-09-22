"use client";

import { useBinanceStream } from "@/hooks/useBinanceStream";
import { usePlaceMarketOrderMutation } from "@/redux/features/trade/tradeApi";
import { useMemo, useState } from "react";

// UI symbol → Binance raw
function toBinanceSymbol(sym: string) {
  let s = sym.replace("/", "").toUpperCase();
  if (s.endsWith("USD")) s = s.replace("USD", "USDT"); // ETH/USD → ETHUSDT
  return s;
}

export default function OrderPanel({
  symbol: uiSymbol,
  account,
}: {
  symbol: string;
  account: any;
}) {
  const symbol = toBinanceSymbol(uiSymbol);
  const { data: bt } = useBinanceStream(symbol, "bookTicker");
  const { data: kline } = useBinanceStream(symbol, "kline_1m");

  const bid = bt?.b ? parseFloat(bt.b) : NaN;
  const ask = bt?.a ? parseFloat(bt.a) : NaN;
  const lastClose = useMemo(() => {
    const k = (kline as any)?.k;
    return k ? parseFloat(k.c) : NaN;
  }, [kline]);

  const [lots, setLots] = useState(0.01);
  const [side, setSide] = useState<"buy" | "sell">("sell");
  const [place, { isLoading }] = usePlaceMarketOrderMutation();
  const [submitting, setSubmitting] = useState(false);

  const dp = useMemo(() => (/(BONK|PEPE|SHIB)/.test(symbol) ? 5 : 3), [symbol]);
  const mid = useMemo(() => {
    if (!Number.isNaN(bid) && !Number.isNaN(ask)) return (bid + ask) / 2;
    return Number.isNaN(lastClose) ? 0 : lastClose;
  }, [bid, ask, lastClose]);

  const leverage = account?.leverage ?? 200;
  const contractSize = useMemo(
    () => (symbol.includes("XAU") ? 100 : 100000),
    [symbol]
  );
  const notional = mid * contractSize * lots;
  const margin = leverage ? notional / leverage : 0;
  const fees = 0.11;

  const pxForSide =
    side === "buy"
      ? Number.isNaN(ask)
        ? lastClose
        : ask
      : Number.isNaN(bid)
      ? lastClose
      : bid;

  const canTrade =
    !!account && lots > 0 && !!pxForSide && !Number.isNaN(pxForSide);

  const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(dp) : "-");

  async function onConfirm() {
    if (!canTrade || submitting) return;
    try {
      setSubmitting(true);
      const res = await place({
        accountId: account._id,
        symbol, // Binance raw
        side,
        lots,
        price: pxForSide, // client hint
      }).unwrap();

      // 🔔 ইভেন্ট: overlay/টিকার আপডেটের জন্য
      window.dispatchEvent(
        new CustomEvent("position:opened", {
          detail: { position: res.position },
        })
      );

      // ছোট নোটিফিকেশন (ঐচ্ছিক)
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { kind: "success", text: "Order placed" },
        })
      );
    } catch (err: any) {
      window.alert?.(err?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-t-2xl bg-neutral-950 border-t border-neutral-800 p-4">
      <div className="text-center text-sm text-neutral-400">Regular</div>

      {/* Volume */}
      <div className="mt-3">
        <div className="text-sm text-neutral-400">Volume</div>
        <div className="mt-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center">
          <button
            className="px-4 py-3 text-xl"
            onClick={() =>
              setLots((v) => Math.max(0.01, +(v - 0.01).toFixed(2)))
            }
          >
            −
          </button>
          <div className="flex-1 text-center text-2xl font-semibold">
            {lots.toFixed(2)}
          </div>
          <button
            className="px-4 py-3 text-xl"
            onClick={() => setLots((v) => +(v + 0.01).toFixed(2))}
          >
            ＋
          </button>
        </div>
      </div>

      {/* Side pick */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          className={`rounded-xl py-3 font-semibold ${
            side === "sell" ? "bg-red-500/90" : "bg-neutral-800"
          }`}
          onClick={() => setSide("sell")}
        >
          Sell {fmt(bid)}
        </button>
        <button
          className={`rounded-xl py-3 font-semibold ${
            side === "buy" ? "bg-blue-600/90" : "bg-neutral-800"
          }`}
          onClick={() => setSide("buy")}
        >
          Buy {fmt(ask)}
        </button>
      </div>

      {/* Confirm */}
      <div className="mt-3">
        <button
          disabled={!canTrade || isLoading || submitting}
          onClick={onConfirm}
          className={`w-full rounded-xl py-3 font-semibold ${
            side === "sell" ? "bg-red-600" : "bg-blue-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {submitting ? (
            "Placing…"
          ) : (
            <>
              Confirm {side === "sell" ? "Sell" : "Buy"} {lots.toFixed(2)} lots{" "}
              {fmt(pxForSide)}
            </>
          )}
        </button>
      </div>

      <div className="mt-3 text-xs text-neutral-400">
        Fees: ~ {fees.toFixed(2)} {account?.currency || "USD"} |
        <span className="ml-1" />
        <span>
          Margin: {Number.isFinite(margin) ? margin.toFixed(2) : "-"}{" "}
          {account?.currency || "USD"} (1:{leverage})
        </span>
      </div>
    </div>
  );
}
