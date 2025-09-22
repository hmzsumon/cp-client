"use client";

import { usePriceStream } from "@/hooks/usePriceStream";
import { useListDemoPositionsQuery } from "@/redux/features/trade/tradeApi";
import { useMemo } from "react";

type Props = {
  accountId?: string;
  symbol: string; // same symbol as chart
  onOpenList: () => void;
  onCloseClick: (posId?: string) => void; // open confirm dialog
};

export default function PositionsStrip({
  accountId,
  symbol,
  onOpenList,
  onCloseClick,
}: Props) {
  const { data } = useListDemoPositionsQuery(
    { accountId: accountId! },
    { skip: !accountId }
  );
  const { price } = usePriceStream(symbol);

  const { openCount, pendingCount, pnl, lastOpenId } = useMemo(() => {
    const items = data?.items ?? [];
    const opens = items.filter((p) => p.status === "open");
    // symbol-wise live PnL sum
    let live = 0;
    for (const p of opens) {
      if (p.symbol !== symbol) continue;
      const sidePx = p.side === "buy" ? price?.bid : price?.ask; // close price
      if (!sidePx || !isFinite(sidePx)) continue;
      const cs =
        (p as any).contractSize ?? (p.symbol.includes("XAU") ? 100 : 1);
      const diff =
        p.side === "buy" ? sidePx - p.entryPrice : p.entryPrice - sidePx;
      live += diff * cs * p.volume; // backend field name volume (aka lots)
    }
    return {
      openCount: opens.length,
      pendingCount: 0,
      pnl: isFinite(live) ? live : 0,
      lastOpenId: opens.find((p) => p.symbol === symbol)?._id,
    };
  }, [data, price, symbol]);

  return (
    <div className="px-3">
      <div className="mt-2 rounded-2xl bg-neutral-900 border border-neutral-800 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenList}
              className="px-3 py-1.5 rounded-full bg-neutral-800 text-sm"
            >
              Open <b className="ml-1">{openCount}</b>
            </button>
            <button className="px-3 py-1.5 rounded-full bg-neutral-800 text-sm opacity-80">
              Pending <b className="ml-1">{pendingCount}</b>
            </button>
          </div>

          {/* PnL + close -> open close dialog */}
          <div
            className={`flex items-center gap-3 px-3 py-1.5 rounded-lg ${
              pnl >= 0
                ? "bg-green-600/15 text-green-400"
                : "bg-red-600/15 text-red-400"
            }`}
          >
            <span>{(pnl >= 0 ? "+" : "") + pnl.toFixed(2)} USD</span>
            <button
              onClick={() => onCloseClick(lastOpenId)}
              className="px-1.5 py-1 rounded bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700"
              title="Close position"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
