// components/trade/PairDrawer.tsx
"use client";

import { useGetSpotBalancesQuery } from "@/redux/features/binance-trade/binance-tradeApi";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { Side } from "./TradeLayout";

interface PairDrawerProps {
  open: boolean;
  selectedSymbol: string;
  side: Side; // 🔥 BUY / SELL জানতে হবে
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
}

// 🔥 Popular & common USDT pairs
const PAIR_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "TONUSDT",
  "TRXUSDT",
  "DOTUSDT",
  "MATICUSDT",
  "LINKUSDT",
  "LTCUSDT",
  "BCHUSDT",
  "OPUSDT",
  "ARBUSDT",
  "INJUSDT",
  "APTUSDT",
  "SUIUSDT",
  "AAVEUSDT",
  "1INCHUSDT",
  "ACMUSDT",
  "ALGOUSDT",
  "ALICEUSDT",
  "ANKRUSDT",
  "ARDRUSDT",
] as const;

interface MiniTickerRaw {
  s: string; // symbol
  c: string; // close (last price)
  o: string; // open price
  v: string; // volume (base asset)
  [key: string]: unknown;
}

interface MiniTicker {
  lastPrice: number;
  changePercent: number;
  volume: number;
}

type TickerMap = Record<string, MiniTicker>;

const PairDrawer: React.FC<PairDrawerProps> = ({
  open,
  selectedSymbol,
  side,
  onClose,
  onSelectSymbol,
}) => {
  const [tickers, setTickers] = useState<TickerMap>({});
  const [search, setSearch] = useState("");

  const { user } = useSelector((state: any) => state.auth);

  // 👉 Spot wallet balances (SELL এ filter করার জন্য)
  const { data: spotBalances, isLoading: balancesLoading } =
    useGetSpotBalancesQuery(undefined, {
      skip: !user?._id, // লগইন না থাকলে কল করবে না
    });

  // আমি যেসব symbol কিনেছি (qty > 0)
  const ownedSymbols = useMemo(() => {
    if (!spotBalances) return [];
    return spotBalances
      .filter((w) => w.qty > 0)
      .map((w) => w.symbol.toUpperCase());
  }, [spotBalances]);

  useEffect(() => {
    if (!open) return;

    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/!miniTicker@arr"
    );

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const arr = JSON.parse(event.data) as MiniTickerRaw[];
        if (!Array.isArray(arr)) return;

        setTickers((prev) => {
          const next: TickerMap = { ...prev };

          arr.forEach((t) => {
            if (!PAIR_SYMBOLS.includes(t.s as (typeof PAIR_SYMBOLS)[number])) {
              return;
            }

            const last = parseFloat(t.c);
            const open = parseFloat(t.o);
            const vol = parseFloat(t.v);

            let changePercent = 0;
            if (open && !Number.isNaN(open) && !Number.isNaN(last)) {
              changePercent = ((last - open) / open) * 100;
            }

            next[t.s] = {
              lastPrice: Number.isNaN(last) ? 0 : last,
              changePercent: Number.isNaN(changePercent) ? 0 : changePercent,
              volume: Number.isNaN(vol) ? 0 : vol,
            };
          });

          return next;
        });
      } catch (error) {
        console.error("pair drawer miniTicker parse error", error);
      }
    };

    return () => {
      ws.close();
    };
  }, [open]);

  // 🔥 side + balance + search মিলিয়ে ফাইনাল symbol লিস্ট
  const filteredSymbols = useMemo(() => {
    const q = search.trim().toLowerCase();

    // base list:
    // BUY → সব PAIR_SYMBOLS
    // SELL → আমি যেগুলো ধরে আছি (ownedSymbols ∩ PAIR_SYMBOLS)
    let baseList: readonly string[] =
      side === "sell"
        ? PAIR_SYMBOLS.filter((s) => ownedSymbols.includes(s))
        : PAIR_SYMBOLS;

    if (!q) return baseList;
    return baseList.filter((s) => s.toLowerCase().includes(q));
  }, [search, side, ownedSymbols]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full rounded-t-3xl bg-slate-950 px-3 pb-4 pt-2 shadow-2xl shadow-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-700" />

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="mb-2 flex justify-between text-[11px]">
          <button
            type="button"
            className="rounded-full bg-slate-800 px-3 py-1 text-yellow-400"
          >
            USDT
          </button>
          {side === "sell" && (
            <span className="text-[10px] text-slate-500">
              {balancesLoading
                ? "Loading balances..."
                : `Showing only coins you own`}
            </span>
          )}
        </div>

        {/* Header */}
        <div className="mb-1 flex justify-between text-[10px] text-slate-400">
          <span>Name / Vol</span>
          <span>Last Price • 24h Chg</span>
        </div>

        {/* List */}
        <div className="max-h-[60vh] overflow-y-auto pb-2 pr-5">
          {filteredSymbols.map((symbol) => {
            const t = tickers[symbol];
            const rawChange = t?.changePercent ?? 0;
            const change = Number.isNaN(rawChange) ? 0 : rawChange;
            const isDown = change < 0;
            const isActive = symbol === selectedSymbol;

            return (
              <button
                key={symbol}
                type="button"
                onClick={() => onSelectSymbol(symbol)}
                className={`flex w-full items-center justify-between py-2 text-left ${
                  isActive ? "bg-slate-800/80" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg ${
                      isActive ? "text-yellow-400" : "text-slate-600"
                    }`}
                  >
                    ★
                  </span>
                  <div>
                    <div className="text-[13px] font-medium">
                      {symbol.replace("USDT", "/USDT")}
                    </div>
                    <div className="mt-[2px] text-[11px] text-slate-500">
                      Vol{" "}
                      {t
                        ? t.volume.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : "--"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-[13px] ${
                      isDown ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {t ? t.lastPrice.toLocaleString() : "--"}
                  </div>
                  <div
                    className={`mt-[2px] text-[11px] ${
                      isDown ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {t ? `${change.toFixed(2)}%` : "--"}
                  </div>
                </div>
              </button>
            );
          })}

          {filteredSymbols.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-500">
              {side === "sell"
                ? balancesLoading
                  ? "Loading balances..."
                  : "You don't own any of these pairs yet"
                : "No results"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PairDrawer;
