/* ── Agent Dashboard Page (composed) ─────────────────────────────────────── */

"use client";

import InvitationMethod from "@/components/agent/InvitationMethod";
import KpiGrid from "@/components/agent/KpiGrid";
import MetricCardsRow from "@/components/agent/MetricCardsRow";
import PeriodTabs from "@/components/agent/PeriodTabs";
import { useState } from "react";
import { useSelector } from "react-redux";

type Range = Parameters<typeof PeriodTabs>[0]["value"];

const AgentDashboardPage: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);

  // get host
  const host = window.location.host;
  // create referral link wit user customer_id
  let referralLink = "";
  if (process.env.NODE_ENV === "development") {
    referralLink = `http://${host}/register-login?tab=create&referral_code=${user?.customerId}`;
  } else {
    referralLink = `https://${host}/register-login?tab=create&referral_code=${user?.customerId}`;
  }
  // short referral link
  const shortReferralLink = referralLink.slice(0, 22) + "...";

  const [range, setRange] = useState<Range>("yesterday");

  return (
    <div className="min-h-dvh bg-[#0b0e11]">
      <main className="mx-auto max-w-6xl space-y-4 py-6">
        {/* ── Agent info ── */}
        <div>
          <h2 className="text-xl ml-2 font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200 drop-shadow">
            Agent Dashboard
          </h2>
        </div>
        {/* ── KPIs ── */}
        <KpiGrid />

        {/* ── Period + Metrics ── */}
        <section className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
          <div className="mb-4">
            <PeriodTabs value={range} onChange={setRange} />
          </div>
          <MetricCardsRow />
        </section>

        {/* ── Referral links ── */}
        <section>
          <InvitationMethod
            code={user?.customerId}
            fullCode={user?.customerId}
            link={shortReferralLink}
            fullLink={referralLink}
          />
        </section>
      </main>
    </div>
  );
};

export default AgentDashboardPage;
