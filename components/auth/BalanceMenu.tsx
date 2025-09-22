"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export default function BalanceMenu({ open }: { open: boolean }) {
  const [hide, setHide] = useState(false);
  return (
    <div
      className={`absolute right-0 mt-2 w-80 rounded-xl border border-neutral-800 bg-neutral-950/95 p-3 shadow-xl transition-all ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-300">Hide balance</span>
        <button
          onClick={() => setHide((v) => !v)}
          className={`relative h-5 w-9 rounded-full transition ${
            hide ? "bg-neutral-600" : "bg-emerald-500/70"
          }`}
          aria-label="Toggle hide balance"
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
              hide ? "right-0.5" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <div className="mt-3 rounded-lg bg-neutral-900/60 p-3">
        <div className="text-lg font-bold text-white">
          {hide ? "••••••" : "0.00"}{" "}
          <span className="text-sm text-neutral-400">USD</span>
        </div>
        <div className="mt-1 text-xs text-neutral-400">Investment wallet</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
          #1182934804799179326
          <button
            className="rounded p-1 hover:bg-neutral-800"
            aria-label="Copy"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
