// FILE: components/dashboard/BalanceCard.tsx
"use client";
export function BalanceCard({ balance }: { balance: string }) {
  return (
    <div className=" rounded-lg border border-white/10 bg-white/5 px-3 py-4">
      <div className="text-sm text-white/70">Total balance</div>
      <div className="mt-1 text-2xl font-semibold">
        {balance} <span className="text-xs align-top text-white/50">USD</span>
      </div>
    </div>
  );
}
