// app/(agent)/AgentDashboardPage.tsx
"use client";

import KpiGrid from "@/components/agent/KpiGrid";
import MetricCardsRow from "@/components/agent/MetricCardsRow";
import { useAgentTeamSummary, type Range } from "@/hooks/useAgentTeamSummary";
import { useState } from "react";
import { useSelector } from "react-redux";

const MyClientsPage: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { kpisText, getMetricsByRange, loading } = useAgentTeamSummary();

  const [range, setRange] = useState<Range>("yesterday");
  const metrics = getMetricsByRange(range);

  return (
    <div className="min-h-dvh bg-[#0b0e11]">
      <main className="mx-auto max-w-6xl space-y-4 py-6">
        <h2 className="ml-2 text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200 drop-shadow">
          My Clients
        </h2>

        <KpiGrid
          loading={loading}
          countOfReferring={kpisText.countOfReferring}
          totalReferralIncome={kpisText.totalReferralIncome}
          level1AiTradeBalance={kpisText.level1AiTradeBalance}
          level1LiveTradeBalance={kpisText.level1LiveTradeBalance}
        />

        <section className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
          <MetricCardsRow
            loading={loading}
            deposit={metrics.deposit}
            withdraw={metrics.withdraw}
            netDeposit={metrics.netDeposit}
            aiTradeRoi={metrics.aiTradeRoi ?? 0}
            volume={metrics.volume}
          />
        </section>
      </main>
    </div>
  );
};

export default MyClientsPage;
