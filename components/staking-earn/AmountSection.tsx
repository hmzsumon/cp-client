"use client";

type Props = {
  amount: string;
  onAmountChange: (v: string) => void;

  assetSymbol: string;

  balance: number; // ✅ max
  minAmount?: number; // ✅ min (default 1)

  minText?: string;
  availableText?: string;

  onMax?: () => void;
};

const AmountSection = ({
  amount,
  onAmountChange,
  assetSymbol,
  balance,
  minAmount = 1,
  minText,
  availableText,
  onMax,
}: Props) => {
  const clampAndSet = (v: string) => {
    if (v === "") return onAmountChange("");

    // decimal allow
    if (!/^\d*\.?\d*$/.test(v)) return;

    const num = Number(v);
    if (!Number.isFinite(num)) return;

    // ✅ min clamp
    let next = num;
    if (next < minAmount) next = minAmount;

    // ✅ max clamp
    if (next > balance) next = balance;

    onAmountChange(String(next));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-white/60 text-sm">Amount</div>
      </div>

      <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex items-center justify-between">
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => clampAndSet(e.target.value)}
          placeholder={minText ?? "Minimum 1"}
          className="bg-transparent outline-none w-full text-base placeholder:text-white/25"
        />

        <div className="flex items-center gap-3 ml-4 shrink-0">
          <div className="text-sm text-white/70">{assetSymbol}</div>
          <button
            type="button"
            onClick={onMax}
            className="text-sm font-semibold text-[#f0c34d] hover:opacity-90"
          >
            Max
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="text-white/60">
          {availableText ?? `Available: ${balance} ${assetSymbol}`}
        </div>
        <div className="text-[11px] text-white/35">
          Min {minAmount} • Max {balance}
        </div>
      </div>
    </div>
  );
};

export default AmountSection;
