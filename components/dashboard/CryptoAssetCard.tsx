"use client";

import Image from "next/image";

type CryptoAssetCardProps = {
  symbol: string; // e.g. "USDT"
  name: string; // e.g. "TetherUS"
  balance: number | string;
  iconSrc: string; // e.g. "/icons/usdt.svg"
  onEarn?: () => void;
  onTrade?: () => void;
};

export default function CryptoAssetCard({
  symbol,
  name,
  balance,
  iconSrc,
  onEarn,
  onTrade,
}: CryptoAssetCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#0F172A] p-4">
      {/* LEFT: icon + name */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#111827]">
          <Image
            src={iconSrc}
            alt={symbol}
            width={24}
            height={24}
            className="h-10 w-10 object-contain"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white leading-tight">
            {symbol}
          </span>
          <span className="mt-0.5 text-xs text-zinc-400 leading-tight">
            {name}
          </span>
        </div>
      </div>

      {/* RIGHT: balance (top) + buttons (bottom) */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-sm font-medium text-white">
          {typeof balance === "number" ? balance.toFixed(4) : balance}
        </span>

        <div className="flex gap-2">
          <button
            onClick={onEarn}
            className="rounded-md bg-[#374151] px-4 py-1 text-xs font-medium text-zinc-100 hover:bg-[#4B5563] transition-colors divide-solid:cursor-not-allowed divide-solid:opacity-50"
            disabled={true}
          >
            Earn
          </button>
          <button
            onClick={onTrade}
            className="rounded-md bg-[#374151] px-4 py-1 text-xs font-medium text-zinc-100 hover:bg-[#4B5563] transition-colors divide-solid:cursor-not-allowed divide-solid:opacity-50"
            disabled={true}
          >
            Trade
          </button>
        </div>
      </div>
    </div>
  );
}
