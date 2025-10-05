/* ── KPI Grid ─────────────────────────────────────────────────────────────── */

"use client";

import KpiTile from "./KpiTile";

const KpiGrid: React.FC = () => {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <KpiTile tone="slate" title="Count of referring" value="0" icon="users" />
      <KpiTile
        tone="teal"
        title="Cumulative volume"
        value="0.00"
        icon="chart"
      />
      <KpiTile
        tone="amber"
        title="Cumulative balance of clients"
        value="0.00"
        icon="wallet"
      />
      <KpiTile
        tone="green"
        title="Cumulative rebate"
        value="0.00"
        icon="cash"
      />
    </section>
  );
};

export default KpiGrid;
