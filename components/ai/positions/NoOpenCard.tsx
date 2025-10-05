"use client";

import Link from "next/link";

export default function NoOpenCard() {
  return (
    <Link href="/trade" className="block">
      <div
        className="
          flex items-center justify-center gap-2 rounded-lg border border-neutral-800
          bg-neutral-900 px-3 py-2 hover:bg-neutral-800 transition-colors
        "
      >
        {/* same round BTC icon */}
        <div className="h-6 w-6 rounded-full bg-yellow-500/90 grid place-items-center text-[11px] font-bold text-black">
          ₿
        </div>
        <div className="text-sm font-medium text-neutral-200">BTC - Trade</div>
      </div>
    </Link>
  );
}
