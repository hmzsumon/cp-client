/* ── KPI Grid ─────────────────────────────────────────────────────────────── */

"use client";

import KpiTile from "./KpiTile";

const KpiGrid: React.FC = () => {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <KpiTile tone="slate" title="Count of referring" value="0" icon="users" />
      <KpiTile
        tone="teal"
        title="Total Referral income"
        value="0.00"
        icon="chart"
      />
      <KpiTile
        tone="amber"
        title="1s Level Ai Trade balance"
        value="0.00"
        icon="wallet"
      />
      <KpiTile
        tone="green"
        title="1s level Live trade balance"
        value="0.00"
        icon="cash"
      />
    </section>
  );
};

export default KpiGrid;

/* ────────── title for Show team data ────────── */
// 1. Count of referring = total 1st level team members
// 2. Cumulative volume = totalVolume (total live trade amounts)
// 3. Ai Trade balance of 1st level clients = totalBalance (total 1st level Ai trade balance of clients)
// 4. Cumulative rebate = totalRebate (total team  ai trade balance of clients)
