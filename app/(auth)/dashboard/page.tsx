// FILE: app/dashboard/page.tsx

"use client";
import { ActionPill } from "@/components/dashboard/ActionPill";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickActionItem } from "@/components/dashboard/QuickActionItem";
import { RecentActivityItem } from "@/components/dashboard/RecentActivityItem";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { TransferSection } from "@/components/dashboard/TransferSection";
import type { Activity, QuickPair } from "@/types/dashboard";
import { useSelector } from "react-redux";

const quickPairs: QuickPair[] = [
  { id: "1", symbol: "BTC/USD", price: "$62.54", change: "2.3" },
];

const activities: Activity[] = [
  {
    id: "a1",
    title: "Transfer",
    date: "Apr 23",
    amount: 150.0,
    currency: "USD",
  },
];

export default function DashboardPage() {
  const { user } = useSelector((state: any) => state.auth);
  return (
    <main className="min-h-screen w-full bg-[#0b0e11] pb-24 text-white">
      <div className="mx-auto max-w-5xl">
        <BalanceCard balance={user?.m_balance ?? "0.00"} />

        <SectionCard
          title="Total Deposits"
          right={
            <span className="text-sm font-medium text-emerald-400">
              +389.72
            </span>
          }
        >
          <div className="flex gap-2">
            <ActionPill>Quick actions</ActionPill>
            <ActionPill>→</ActionPill>
            <ActionPill>⇄</ActionPill>
            <ActionPill>Transfer</ActionPill>
          </div>
        </SectionCard>

        <SectionCard title="Quick actions">
          <div className="space-y-3">
            {quickPairs.map((p) => (
              <QuickActionItem key={p.id} pair={p} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent activity">
          <div className="space-y-3">
            {activities.map((a) => (
              <RecentActivityItem key={a.id} activity={a} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Transfer">
          <TransferSection />
        </SectionCard>
      </div>
    </main>
  );
}
