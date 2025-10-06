// FILE: app/dashboard/page.tsx

"use client";

/* ── imports ─────────────────────────────────────────────────────────────── */
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { RecentActivityItem } from "@/components/dashboard/RecentActivityItem";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { useGetDashboardQuery } from "@/redux/features/auth/authApi";
import type { Activity } from "@/types/dashboard";
import Link from "next/link";
import { useSelector } from "react-redux";

/* ── tiny utils ──────────────────────────────────────────────────────────── */
const toAmt = (n: unknown) => {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? Number(v.toFixed(2)) : 0;
};

export default function DashboardPage() {
  const { user } = useSelector((state: any) => state.auth);
  const { data, isLoading, isError } = useGetDashboardQuery(undefined);

  const wallet = data?.walletData ?? {};
  const {
    totalDeposit,
    totalWithdraw,
    totalAiTradeProfit,
    totalAiTradeCommission,
    totalLiveTradeProfit,
    totalLiveTradeCommission,
    totalTransferToTrade,
    totalTransferToWallet,
    totalReceive,
    totalSend,
    totalReferBonus,
    rankEarning,
  } = wallet as Record<string, unknown>;

  /* ── activities from API ──────────────────────────────────────────────── */
  const aiActivities: Activity[] = [
    {
      id: "ai_profit",
      title: "Ai Trade Profit",
      amount: toAmt(totalAiTradeProfit),
      currency: "USDT",
    },
    {
      id: "ai_comm",
      title: "Ai Trade Roi",
      amount: toAmt(totalAiTradeCommission),
      currency: "USDT",
    },
  ];

  const liveTradeActivities: Activity[] = [
    {
      id: "lv_profit",
      title: "Live Trade Profit",
      amount: toAmt(totalLiveTradeProfit),
      currency: "USDT",
    },
    {
      id: "lv_comm",
      title: "Live Trade Roi",
      amount: toAmt(totalLiveTradeCommission),
      currency: "USDT",
    },
  ];

  const transferActivities: Activity[] = [
    {
      id: "t2trade",
      title: "Transfer to Trade",
      amount: toAmt(totalTransferToTrade),
      currency: "USDT",
    },
    {
      id: "t2wallet",
      title: "Transfer to Wallet",
      amount: toAmt(totalTransferToWallet),
      currency: "USDT",
    },
  ];

  const p2pActivities: Activity[] = [
    {
      id: "recv",
      title: "Total Received",
      amount: toAmt(totalReceive),
      currency: "USDT",
    },
    {
      id: "send",
      title: "Total Sent",
      amount: toAmt(totalSend),
      currency: "USDT",
    },
  ];

  const bonusActivities: Activity[] = [
    {
      id: "ref_bonus",
      title: "Referral Bonus",
      amount: toAmt(totalReferBonus),
      currency: "USDT",
    },
    {
      id: "rank_reward",
      title: "Rank Reward",
      amount: toAmt(rankEarning),
      currency: "USDT",
    },
  ];

  /* ── ui ───────────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen w-full bg-[#0b0e11] pb-24 text-white">
      <div className="mx-auto max-w-5xl">
        {/* ── balances (show inline spinner on each value while loading) ───── */}
        <div className="space-y-4">
          <BalanceCard
            title="Main balance"
            balance={toAmt(user?.m_balance ?? 0)}
            linkTitle="Deposit"
            url="/deposit"
            isLoading={isLoading}
          />
          <BalanceCard
            title="Total Deposits"
            balance={toAmt(totalDeposit)}
            linkTitle="Details"
            url="/deposit-history"
            isLoading={isLoading}
          />
          <BalanceCard
            title="Total Withdrawals"
            balance={toAmt(totalWithdraw)}
            linkTitle="Details"
            url="/withdraw-history"
            isLoading={isLoading}
          />
        </div>

        {/* ── Ai Trade activity ───────────────────────────────────────────── */}
        <SectionCard title="Ai Trade activity">
          <div className="space-y-3">
            {aiActivities.map((a) => (
              <RecentActivityItem
                key={a.id}
                activity={a}
                isLoading={isLoading}
              />
            ))}
          </div>
        </SectionCard>

        {/* ── Live Trade activity ─────────────────────────────────────────── */}
        <SectionCard title="Live Trade activity">
          <div className="space-y-3">
            {liveTradeActivities.map((a) => (
              <RecentActivityItem
                key={a.id}
                activity={a}
                isLoading={isLoading}
              />
            ))}
          </div>
        </SectionCard>

        {/* ── Transfer activity ───────────────────────────────────────────── */}
        <SectionCard title="Transfer activity">
          <div className="space-y-3">
            {transferActivities.map((a) => (
              <RecentActivityItem
                key={a.id}
                activity={a}
                isLoading={isLoading}
              />
            ))}
          </div>
        </SectionCard>

        {/* ── P2P activity ───────────────────────────────────────────────── */}
        <SectionCard title="P2P activity">
          <div className="space-y-3">
            {p2pActivities.map((a) => (
              <RecentActivityItem
                key={a.id}
                activity={a}
                isLoading={isLoading}
              />
            ))}
          </div>
        </SectionCard>

        {/* ── Bonus activity ──────────────────────────────────────────────── */}
        <SectionCard title="Bonus activity">
          <div className="space-y-3">
            {bonusActivities.map((a) => (
              <RecentActivityItem
                key={a.id}
                activity={a}
                isLoading={isLoading}
              />
            ))}
          </div>
          <Link href="/agent-zone/referral" className=" ">
            <button className="mt-3 w-full rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 py-3 text-center text-base font-semibold text-neutral-950 hover:opacity-90">
              Invite friends & Earn
            </button>
          </Link>
        </SectionCard>

        {isError ? (
          <p className="mt-6 text-center text-sm text-red-400">
            Failed to load dashboard data. Showing zeros.
          </p>
        ) : null}
      </div>
    </main>
  );
}
