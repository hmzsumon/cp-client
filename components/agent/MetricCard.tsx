/* ── Metric Card ──────────────────────────────────────────────────────────── */

"use client";

import { Info } from "lucide-react";

type Props = {
  label: string;
  amount: string; // "0.00 USD"
  suffix?: string; // "(USD)" for Volume per screenshot
  onMore?: () => void;
};

const MetricCard: React.FC<Props> = ({ label, amount, suffix, onMore }) => {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <div>
        <p className="text-2xl font-bold text-neutral-100">{amount}</p>
        {suffix ? <p className="text-xs text-neutral-400">{suffix}</p> : null}
        <p className="mt-1 text-sm text-neutral-300">{label}</p>
      </div>

      <button
        type="button"
        onClick={onMore}
        className="mt-4 inline-flex items-center gap-2 self-start rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-900"
      >
        More detail <Info size={14} />
      </button>
    </div>
  );
};

export default MetricCard;
