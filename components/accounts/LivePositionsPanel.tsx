"use client";

import { useState } from "react";
import ClosedList from "./LiveClosedList";
import OpenList from "./LiveOpenList";
import type { Position } from "./types";

// const demoClosed: Position[] = [
//   {
//     id: "cl1",
//     symbol: "BTC",
//     side: "buy",
//     lots: 1,
//     entryPrice: 120628.74,
//     closePrice: 120630.74,
//     pnlUsd: 2,
//     tag: "TP",
//     closedAt: "2025-10-03T20:30:00.000Z",
//     s: "BTC",
//     status: "closed",
//     profit: 2,
//   },
//   {
//     id: "cl2",
//     symbol: "BTC",
//     side: "sell",
//     lots: 1,
//     entryPrice: 120567.55,
//     closePrice: 120566.17,
//     pnlUsd: 1.38,
//     tag: "TP",
//     closedAt: "2025-10-03T18:10:00.000Z",
//     s: "BTC",
//     status: "closed",
//     profit: 1.38,
//   },
//   {
//     id: "cl3",
//     symbol: "BTC",
//     side: "buy",
//     lots: 1,
//     entryPrice: 120100.17,
//     closePrice: 120141.04,
//     pnlUsd: 40.87,
//     tag: "TP",
//     closedAt: "2025-10-02T15:45:00.000Z",
//     s: "BTC",
//     status: "closed",
//     profit: 40.87,
//   },
// ];

const demoClosed: Position[] = [];
function badge(n: number) {
  return (
    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-neutral-700 px-1.5 text-[10px] font-semibold text-neutral-200">
      {n}
    </span>
  );
}

export default function LivePositionsPanel() {
  const [tab, setTab] = useState<"open" | "closed">("open");
  // const { count } = useFilteredOpenPositions();
  const count = 0;

  return (
    <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-3">
      {/* Tabs */}
      <div className="mb-3 flex items-center gap-6 text-sm border-b border-neutral-800 pb-3">
        <button
          onClick={() => setTab("open")}
          className={`relative pb-1 ${
            tab === "open"
              ? "text-neutral-100"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Open
          {count > 0 && badge(count)}
          {tab === "open" && (
            <span className="absolute -bottom-[2.5px] left-0 h-[1.5px] w-full bg-neutral-200 rounded" />
          )}
        </button>

        <button
          onClick={() => setTab("closed")}
          className={`relative pb-1 ${
            tab === "closed"
              ? "text-neutral-100"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Closed
          {tab === "closed" && (
            <span className="absolute -bottom-[2.5px] left-0 h-[1.5px] w-full bg-neutral-200 rounded" />
          )}
        </button>
      </div>

      {/* Body */}
      {tab === "open" ? <OpenList /> : <ClosedList items={demoClosed} />}
    </div>
  );
}
