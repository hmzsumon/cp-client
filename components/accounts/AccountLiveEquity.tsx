// components/trade/parts/AccountLiveEquity.tsx
"use client";

/* ────────── imports ────────── */
import LiveGroupPnlProbe from "@/components/ui/LiveGroupPnlProbe";
import { useGetOpenPositionsByAccountQuery } from "@/redux/features/trade/tradeApi";
import { useEffect, useMemo, useState } from "react";

/* ────────── utils ────────── */
function fmt(n: number, d = 2) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

/* ────────── types ────────── */
type Props = {
  accountId: string;
  baseBalance: number;
  className?: string;
};

/* ────────── component ────────── */
export default function AccountLiveEquity({
  accountId,
  baseBalance,
  className = "",
}: Props) {
  /* ────────── query open positions ────────── */
  const { data, isFetching } = useGetOpenPositionsByAccountQuery({ accountId });

  /* ────────── normalize response shape ────────── */
  const positions: any[] = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as any).items)) return (data as any).items;
    if (data && Array.isArray((data as any).positions))
      return (data as any).positions;
    return [];
  }, [data]);

  /* ────────── group by symbol ────────── */
  const open = positions;
  const bySymbol = useMemo(() => {
    const g: Record<string, typeof open> = {};
    for (const p of open) {
      const k = (p.symbol || "").toUpperCase();
      (g[k] ||= []).push(p);
    }
    return g;
  }, [open]);

  /* ────────── probe state ────────── */
  const symbols = useMemo(() => Object.keys(bySymbol).sort(), [bySymbol]);
  const [pnlMap, setPnlMap] = useState<Record<string, number>>({});

  /* ────────── probe callback ────────── */
  const onProbe = (symbol: string, value: number) => {
    setPnlMap((m) => (m[symbol] === value ? m : { ...m, [symbol]: value }));
  };

  /* ────────── seed NaN slots for loading state ────────── */
  useEffect(() => {
    const seeded: Record<string, number> = {};
    for (const s of symbols) seeded[s] = pnlMap[s] ?? NaN;
    setPnlMap(seeded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join("|")]);

  /* ────────── loading & aggregates ────────── */
  const loadingPrices =
    symbols.length > 0 && symbols.some((s) => !Number.isFinite(pnlMap[s]));

  const totalLivePnl = useMemo(
    () =>
      Object.values(pnlMap).reduce(
        (acc, v) => acc + (Number.isFinite(v) ? v : 0),
        0
      ),
    [pnlMap]
  );

  const equity = baseBalance + totalLivePnl;

  /* ────────── tone by P/L sign ────────── */
  const tone =
    totalLivePnl > 0
      ? {
          ring: "ring-emerald-500/40",
          bg: "bg-emerald-900/20",
          text: "text-emerald-300",
        }
      : totalLivePnl < 0
      ? {
          ring: "ring-rose-500/40",
          bg: "bg-rose-900/20",
          text: "text-rose-300",
        }
      : {
          ring: "ring-neutral-600/30",
          bg: "bg-neutral-900/70",
          text: "text-neutral-200",
        };

  /* ────────── render ────────── */
  return (
    <>
      {/* ────────── attach price probes per symbol ────────── */}
      {symbols.map((s) => (
        <LiveGroupPnlProbe
          key={s}
          symbol={s}
          positions={bySymbol[s]}
          onChange={onProbe}
        />
      ))}

      {/* ────────── equity pill ────────── */}
      <div
        className={[
          "flex items-center justify-center gap-3 px-3 py-1.5 rounded-full border border-neutral-700 shadow-sm",
          "ring-1 transition-colors",
          tone.ring,
          tone.bg,
          className,
        ].join(" ")}
      >
        {isFetching || loadingPrices ? (
          <span className="flex items-center gap-2 text-neutral-300">
            <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span className="font-medium opacity-80">live</span>
          </span>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className={["font-semibold", tone.text].join(" ")}>
              {fmt(equity, 2)} USDT
            </span>
            <span
              className={[
                "text-[11px] leading-none font-medium",
                totalLivePnl > 0
                  ? "text-emerald-300"
                  : totalLivePnl < 0
                  ? "text-rose-300"
                  : "text-neutral-300",
              ].join(" ")}
              title="Live P/L"
            >
              {totalLivePnl > 0 ? "+" : ""}
              {fmt(totalLivePnl, 2)}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
