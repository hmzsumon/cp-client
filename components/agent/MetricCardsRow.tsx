/* ── Metric Cards Row ─────────────────────────────────────────────────────── */

"use client";

import MetricCard from "./MetricCard";

const MetricCardsRow: React.FC = () => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        {/* ── Tabs left ── */}
        {/* Tabs are passed by parent; this section only holds the grid */}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Deposit" amount="0.00 USD" />
        <MetricCard label="Withdrawal" amount="0.00 USD" />
        <MetricCard label="Net deposit" amount="0.00 USD" />
        <MetricCard label="Rebate" amount="0.00 USD" />
        <MetricCard label="Volume" amount="0.00 USD" suffix="(USD)" />
      </div>
    </section>
  );
};

export default MetricCardsRow;
