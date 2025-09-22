"use client";

import { usePriceStream } from "@/hooks/usePriceStream";
import { useClosePositionMutation } from "@/redux/features/trade/tradeApi";
import { useMemo, useState } from "react";

export default function ClosePositionDialog({
  position,
  lastPrice,
  onDone,
}: {
  position: {
    _id: string;
    symbol: string;
    side: "buy" | "sell";
    volume: number;
    entryPrice: number;
  };
  lastPrice: number;
  onDone: () => void;
}) {
  const { price } = usePriceStream(position.symbol);
  const px =
    position.side === "buy" ? price?.bid ?? lastPrice : price?.ask ?? lastPrice;
  const [closeMut, { isLoading }] = useClosePositionMutation();
  const [error, setError] = useState<string | null>(null);

  const pnl = useMemo(() => {
    const diff =
      position.side === "buy"
        ? px - position.entryPrice
        : position.entryPrice - px;
    return diff * position.volume;
  }, [px, position]);

  const submit = async () => {
    try {
      const res = await closeMut({ id: position._id, price: px }).unwrap();

      window.dispatchEvent(
        new CustomEvent("position:closed", {
          detail: { id: position._id, res },
        })
      );
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            kind: pnl >= 0 ? "success" : "info",
            text: `Order closed • P/L: ${pnl.toFixed(2)} USD`,
          },
        })
      );
      onDone();
    } catch (e: any) {
      setError(e?.data?.message || "Close failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/60" onClick={onDone} />
      <div className="absolute left-0 right-0 bottom-0 bg-neutral-950 rounded-t-2xl p-5 border-t border-neutral-800">
        <div className="text-center text-lg font-semibold mb-2">
          Close position #{position._id.slice(-7)} ?
        </div>

        <div className="flex justify-between text-sm text-neutral-300 mb-3">
          <div>Lots</div>
          <div>{position.volume.toFixed(2)}</div>
        </div>
        <div className="flex justify-between text-sm text-neutral-300 mb-3">
          <div>Closing price</div>
          <div>{px.toFixed(2)}</div>
        </div>
        <div
          className={`flex justify-between text-sm mb-4 ${
            pnl >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          <div>{pnl >= 0 ? "Profit" : "Loss"}</div>
          <div>
            {pnl >= 0 ? "+" : ""}
            {pnl.toFixed(2)} USD
          </div>
        </div>

        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDone}
            className="rounded-xl py-3 bg-neutral-800"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-xl py-3 bg-yellow-400 text-black font-semibold disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? "Closing…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
