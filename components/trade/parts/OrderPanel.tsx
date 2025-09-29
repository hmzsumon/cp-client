/* components/trade/OrderPanel.tsx */
"use client";

import { useUnifiedPrice } from "@/hooks/useUnifiedPrice"; // ✅ একক সোর্স
import { usePlaceMarketOrderMutation } from "@/redux/features/trade/tradeApi";
import { ChangeEvent, KeyboardEvent, useMemo, useState } from "react";

/* UI symbol → Binance raw */
function toBinanceSymbol(sym: string) {
  let s = sym.replace("/", "").toUpperCase();
  if (s.endsWith("USD")) s = s.replace("USD", "USDT"); // ETH/USD → ETHUSDT
  return s;
}

/* helpers for lots */
function clampLots(v: number) {
  if (!Number.isFinite(v)) return 0.01;
  return Math.max(0.01, +v.toFixed(2));
}
function addLots(v: number, d = 0.01) {
  return clampLots(v + d);
}
function subLots(v: number, d = 0.01) {
  return clampLots(v - d);
}

export default function OrderPanel({
  symbol: uiSymbol,
  account,
}: {
  symbol: string;
  account: any;
}) {
  const symbol = toBinanceSymbol(uiSymbol);

  // ✅ unified mid/bid/ask (BTC→ ~ $12+ স্প্রেড অটো সেট হয়)
  const { mid, bid, ask, spreadAbs, spreadPm } = useUnifiedPrice(symbol);

  const [lots, setLots] = useState(0.01);
  const [lotsText, setLotsText] = useState(lots.toFixed(2));
  const [side, setSide] = useState<"buy" | "sell">("sell");
  const [place, { isLoading }] = usePlaceMarketOrderMutation();
  const [submitting, setSubmitting] = useState(false);

  const dp = useMemo(() => (/(BONK|PEPE|SHIB)/.test(symbol) ? 5 : 2), [symbol]);

  const leverage = account?.leverage ?? 200;
  const contractSize = useMemo(
    () => (symbol.includes("XAU") ? 100 : 1), // ⚠️ Crypto = 1
    [symbol]
  );
  const notional = (mid || 0) * contractSize * lots;
  const margin = leverage ? notional / leverage : 0;

  const pxForSide = side === "buy" ? ask : bid; // ✅ unified bid/ask
  const canTrade = !!account && lots > 0 && Number.isFinite(pxForSide);

  const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(dp) : "–");

  /* lots input handlers */
  const onLotsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.]/g, "");
    const parts = raw.split(".");
    const safe =
      parts.length > 1 ? parts[0] + "." + parts.slice(1).join("") : raw;
    setLotsText(safe);
    const n = Number(safe);
    if (Number.isFinite(n)) setLots(n);
  };
  const onLotsBlur = () => {
    const clamped = clampLots(Number(lotsText));
    setLots(clamped);
    setLotsText(clamped.toFixed(2));
  };
  const onLotsKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      const v = addLots(lots);
      setLots(v);
      setLotsText(v.toFixed(2));
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      const v = subLots(lots);
      setLots(v);
      setLotsText(v.toFixed(2));
      e.preventDefault();
    }
  };

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

      window.dispatchEvent(
        new CustomEvent("position:opened", {
          detail: { position: res.position },
        })
      );
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
    <div className="relative rounded-t-lg bg-neutral-950 border-t border-neutral-800 p-3">
      {/* ছোট রিবন: স্প্রেড ইনফো */}
      <div className="absolute -top-3 right-2 text-[10px] px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
        spread ~ {Number.isFinite(spreadAbs) ? spreadAbs.toFixed(dp) : "–"} (
        {Number.isFinite(spreadPm) ? spreadPm.toFixed(2) : "–"}‰)
      </div>

      {/* Volume (lots) */}
      <div>
        <div className="mb-1 text-sm text-neutral-400">Volume (lots)</div>
        <div className="flex rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <button
            type="button"
            className="px-4 py-2 text-xl hover:bg-neutral-800"
            onClick={() => {
              const v = subLots(lots);
              setLots(v);
              setLotsText(v.toFixed(2));
            }}
          >
            −
          </button>

          <input
            inputMode="decimal"
            pattern="[0-9]*[.]?[0-9]*"
            value={lotsText}
            onChange={onLotsChange}
            onBlur={onLotsBlur}
            onKeyDown={onLotsKey}
            className="flex-1 bg-transparent text-center outline-none py-2 font-semibold"
            aria-label="Lots"
          />

          <button
            type="button"
            className="px-4 py-2 text-xl hover:bg-neutral-800"
            onClick={() => {
              const v = addLots(lots);
              setLots(v);
              setLotsText(v.toFixed(2));
            }}
          >
            ＋
          </button>
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Step: 0.01 • Minimum: 0.01
        </div>
      </div>

      {/* Sell / Buy with center spread chip */}
      <div className="mt-3 relative">
        <div className="grid grid-cols-2 gap-3">
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

        {/* spread chip (Exness-style; position: relative container) */}
        <div
          className="
            pointer-events-none absolute top-3 left-1/2 -translate-x-1/2
            z-10 rounded-md border border-neutral-800
            bg-neutral-900 px-2 py-0.5 text-[12px] font-semibold
            text-neutral-300 shadow
          "
          title="Spread (Ask − Bid)"
        >
          {Number.isFinite(spreadAbs) ? spreadAbs.toFixed(dp) : "—"}
        </div>
      </div>

      {/* Confirm */}
      <div className="mt-3">
        <button
          disabled={!canTrade || isLoading || submitting}
          onClick={onConfirm}
          className={`w-full rounded-xl text-sm py-2.5 font-semibold ${
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

      <div className="mt-2 text-xs text-neutral-400">
        Margin: {Number.isFinite(margin) ? margin.toFixed(2) : "–"}{" "}
        {account?.currency || "USD"} (1:{leverage})
      </div>
    </div>
  );
}
