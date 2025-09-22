// components/trade/InstrumentHeader.tsx
"use client";

import {
  ChevronDown,
  Maximize2,
  MoreVertical,
  PlusCircle,
  Settings,
} from "lucide-react";

export default function InstrumentHeader({
  symbol,
  onOpenDrawer,
}: {
  symbol: string;
  onOpenDrawer: () => void;
}) {
  const pretty = prettify(symbol);
  return (
    <div className="px-3">
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 px-3 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenDrawer}
            className="text-2xl font-semibold flex items-center gap-2"
          >
            {pretty} <ChevronDown className="w-5 h-5 opacity-70" />
          </button>
          <div className="flex items-center gap-3 opacity-80">
            <PlusCircle className="w-5 h-5" />
            <Maximize2 className="w-5 h-5" />
            <Settings className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex gap-6 text-sm">
          <span className="px-2 py-1 rounded-full bg-neutral-800">
            Open <b className="ml-1">0</b>
          </span>
          <span className="px-2 py-1 rounded-full bg-neutral-800">
            Pending <b className="ml-1">0</b>
          </span>
        </div>
      </div>
    </div>
  );
}
function prettify(s: string) {
  if (s.includes("/")) return s;
  if (s.endsWith("USDT")) return s.replace("USDT", "/USD");
  if (s.length === 6) return `${s.slice(0, 3)}/${s.slice(3)}`;
  return s;
}
