"use client";

import { useListDemoPositionsQuery } from "@/redux/features/trade/tradeApi";
import { useMemo, useState } from "react";
import ClosePositionDialog from "./parts/ClosePositionDialog";
import InstrumentDrawer from "./parts/InstrumentDrawer";
import InstrumentHeader from "./parts/InstrumentHeader";
import LiveChart from "./parts/LiveChart";
import OrderPanel from "./parts/OrderPanel";
import PositionBadgeOverlay from "./parts/PositionBadgeOverlay";
import PositionsStrip from "./parts/PositionsStrip";

// small balance pill like Exness
function BalancePill({ account }: { account?: any }) {
  const label = account?.mode === "demo" ? "Demo" : "Real";
  const bal =
    typeof account?.balance === "number" ? account.balance.toFixed(2) : "0.00";
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-2 z-50">
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 shadow-md">
        <span className="px-2 py-0.5 rounded-full bg-green-700/40 text-green-300 text-xs">
          {label}
        </span>
        <span className="font-semibold">{bal} USD</span>
      </div>
    </div>
  );
}

export default function TradeScreen({ account }: { account: any }) {
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [drawer, setDrawer] = useState(false);

  const [openList, setOpenList] = useState(false);
  const [closeTargetId, setCloseTargetId] = useState<string | undefined>(
    undefined
  );

  // fetch positions for list (simple sheet)
  const { data } = useListDemoPositionsQuery(
    { accountId: account?._id },
    { skip: !account?._id }
  );
  const positions = data?.items ?? [];
  const target = useMemo(
    () => positions.find((p) => p._id === closeTargetId),
    [positions, closeTargetId]
  );

  return (
    <div className="flex flex-col h-full">
      {/* top balance pill */}
      <BalancePill account={account} />

      {/* header */}
      <InstrumentHeader symbol={symbol} onOpenDrawer={() => setDrawer(true)} />

      {/* status strip like Exness */}
      <PositionsStrip
        accountId={account?._id}
        symbol={symbol}
        onOpenList={() => setOpenList(true)}
        onCloseClick={(id) => {
          if (id) setCloseTargetId(id);
          else setOpenList(true);
        }}
      />

      {/* chart */}
      <div className="flex-1 relative mt-2">
        <LiveChart symbol={symbol} />
        {/* in-chart live badge + close */}
        <PositionBadgeOverlay symbol={symbol} />
      </div>

      {/* order panel */}
      <div className="mt-2">
        <OrderPanel symbol={symbol} account={account} />
      </div>

      {/* instrument drawer */}
      <InstrumentDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        onPick={(s) => {
          setSymbol(s);
          setDrawer(false);
        }}
      />

      {/* positions list sheet (very light) */}
      {openList && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpenList(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto">
            <div className="text-center font-semibold mb-3">Open positions</div>
            {positions
              .filter((p) => p.status === "open")
              .map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between rounded-xl bg-neutral-900 border border-neutral-800 p-3 mb-2"
                >
                  <div>
                    <div className="font-semibold">{p.symbol}</div>
                    <div className="text-xs text-neutral-400">
                      {p.side.toUpperCase()} • {p.volume.toFixed(2)} @{" "}
                      {p.entryPrice.toFixed(3)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCloseTargetId(p._id);
                      setOpenList(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black font-semibold"
                  >
                    Close
                  </button>
                </div>
              ))}
            {positions.filter((p) => p.status === "open").length === 0 && (
              <div className="text-center text-neutral-400 py-6">
                No open positions
              </div>
            )}
          </div>
        </div>
      )}

      {/* close dialog from strip/list */}
      {target && (
        <ClosePositionDialog
          position={{
            _id: target._id,
            symbol: target.symbol,
            side: target.side,
            volume: target.volume,
            entryPrice: target.entryPrice,
          }}
          lastPrice={target.entryPrice}
          onDone={() => setCloseTargetId(undefined)}
        />
      )}
    </div>
  );
}
