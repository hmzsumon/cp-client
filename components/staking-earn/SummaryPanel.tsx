"use client";

type Props = {
  assetSymbol: string;
  tier1Apr: number;
  tier2Apr: number;
};

const SummaryPanel = ({ assetSymbol, tier1Apr, tier2Apr }: Props) => {
  return (
    <div className="rounded-2xl bg-[#111822] border border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="text-white/75 text-sm font-medium">
          Est. Daily Rewards
        </div>

        {/* ✅ এখানে এখন --USDT নয়, symbol */}
        <div className="text-white/50 text-sm">
          -- <span className="text-[#63e6be]">{assetSymbol}</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/80">
            <span className="h-2.5 w-2.5 rotate-45 bg-white/70 inline-block rounded-[2px]" />
            <span className="text-sm">0-0.2 {assetSymbol}</span>
          </div>
          <div className="text-sm text-white/80">
            APR{" "}
            <span className="font-semibold">
              {tier1Apr.toFixed(2).replace(/\.00$/, "")}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between opacity-85">
          <div className="flex items-center gap-2 text-white/60">
            <span className="h-2.5 w-2.5 rotate-45 bg-white/35 inline-block rounded-[2px]" />
            <span className="text-sm">&gt;0.2 {assetSymbol}</span>
          </div>
          <div className="text-sm text-white/60">
            APR{" "}
            <span className="font-semibold">
              {tier2Apr.toFixed(2).replace(/\.00$/, "")}%
            </span>
          </div>
        </div>

        <p className="pt-2 text-xs text-white/40 leading-relaxed">
          *APR does not represent actual or predicted returns in fiat currency.
          Please refer to the Product Rules for reward mechanisms.
        </p>
      </div>
    </div>
  );
};

export default SummaryPanel;
