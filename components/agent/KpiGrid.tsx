// components/agent/KpiGrid.tsx
"use client";

import KpiTile from "./KpiTile";

const KpiGrid: React.FC<{
  loading?: boolean;
  countOfReferring: string; // already formatted text
  totalReferralIncome: string; // $
  level1AiTradeBalance: string; // $
  level1LiveTradeBalance: string; // $
}> = ({
  loading = false,
  countOfReferring,
  totalReferralIncome,
  level1AiTradeBalance,
  level1LiveTradeBalance,
}) => {
  const v = (t: string) => (loading ? "…" : t);

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <KpiTile
        tone="slate"
        title="Count of referring"
        value={v(countOfReferring)}
        icon="users"
      />
      <KpiTile
        tone="teal"
        title="Total Referral income"
        value={v(totalReferralIncome)}
        icon="chart"
      />
      <KpiTile
        tone="amber"
        title="1st level AI trade balance"
        value={v(level1AiTradeBalance)}
        icon="wallet"
      />
      <KpiTile
        tone="green"
        title="1st level Live trade balance"
        value={v(level1LiveTradeBalance)}
        icon="cash"
      />
    </section>
  );
};

export default KpiGrid;
