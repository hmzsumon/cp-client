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
    <div className="">
      <div className="rounded-lg bg-neutral-900 border border-neutral-800 px-1 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenDrawer}
            className="text-sm font-semibold flex items-center gap-2"
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
