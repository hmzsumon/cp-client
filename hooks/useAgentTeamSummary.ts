// hooks/useAgentTeamSummary.ts
"use client";

import { useGetMyTeamQuery } from "@/redux/features/auth/authApi";
import { useMemo } from "react";

/* ── Types coming from your API ────────────────────────────── */
export type TeamLevel = {
  title: string;
  users: string[]; // user ids
  deposit: number;
  activeDeposit: number;
  withdraw: number;
  aiTradeBalance: number;
  liveTradeBalance: number;
};

export type TeamSummary = {
  _id: string;
  userId: string;
  customerId: string;
  title: string;

  // Top-level totals
  totalTeamMember: number;
  teamActiveMember: number;

  totalTeamDeposit: number;
  totalTeamWithdraw: number;
  totalTeamActiveDeposit: number;

  totalReferralBonus: number; // all-time team commission?
  todayTeamCommission: number;
  yesterdayTeamCommission: number;
  thisMonthCommission: number;

  thisMonthSales: number;
  lastMonthSales: number;

  teamTotalAiTradeBalance: number;
  teamTotalLiveTradeBalance: number;

  teamTotalAiTradeCommission: number;

  // per-level
  level_1: TeamLevel;
  level_2: TeamLevel;
  level_3: TeamLevel;
  level_4: TeamLevel;
  level_5: TeamLevel;
  level_6: TeamLevel;
  level_7: TeamLevel;
  level_8: TeamLevel;
  level_9: TeamLevel;
  level_10: TeamLevel;
};

export type Range = "yesterday" | "lastWeek" | "thisMonth" | "lastMonth";

/* ── Helpers ───────────────────────────────────────────────── */
const fmt = (n?: number) =>
  (Number.isFinite(n as number) ? (n as number) : 0).toFixed(2);

/* ── Hook ──────────────────────────────────────────────────── */
export function useAgentTeamSummary() {
  const { data, isLoading, isFetching, isError, error } = useGetMyTeamQuery({});
  const team = data?.team as TeamSummary | undefined;

  // Flatten levels array (handy in tables/loops)
  const levels: TeamLevel[] = useMemo(() => {
    if (!team) return [];
    return [
      team.level_1,
      team.level_2,
      team.level_3,
      team.level_4,
      team.level_5,
      team.level_6,
      team.level_7,
      team.level_8,
      team.level_9,
      team.level_10,
    ].filter(Boolean) as TeamLevel[];
  }, [team]);

  // KPIs you needed on the top grid
  const kpis = useMemo(() => {
    return {
      countOfReferring: team?.totalTeamMember ?? 0,
      totalReferralIncome: team?.totalReferralBonus ?? 0, // বা totalReferralBonus থাকলে সেটি নিন
      level1AiTradeBalance: team?.level_1?.aiTradeBalance ?? 0,
      level1LiveTradeBalance: team?.level_1?.liveTradeBalance ?? 0,
    };
  }, [team]);

  // Metric cards — range-aware
  // (আপনার API তে weekly নেই, তাই lastWeek -> 0 দেখাই বা ভবিষ্যতে ফিল্ড এলে ম্যাপ করুন)
  const getMetricsByRange = (range: Range) => {
    switch (range) {
      case "yesterday":
        return {
          deposit: team?.totalTeamDeposit ?? 0, // যদি আপনার কাছে daily deposit না থাকে,
          withdraw: team?.totalTeamWithdraw ?? 0, // এখানে মোট দেখাচ্ছি
          netDeposit: team?.teamTotalAiTradeBalance ?? 0,
          aiTradeRoi: team?.teamTotalAiTradeCommission ?? 0,
          volume: team?.thisMonthSales ?? 0,
        };
      case "thisMonth":
        return {
          deposit: team?.totalTeamDeposit ?? 0,
          withdraw: team?.totalTeamWithdraw ?? 0,
          netDeposit:
            (team?.totalTeamDeposit ?? 0) - (team?.totalTeamWithdraw ?? 0),
          rebate: team?.thisMonthCommission ?? 0,
          volume: team?.thisMonthSales ?? 0,
        };
      case "lastMonth":
        return {
          deposit: team?.totalTeamDeposit ?? 0,
          withdraw: team?.totalTeamWithdraw ?? 0,
          netDeposit:
            (team?.totalTeamDeposit ?? 0) - (team?.totalTeamWithdraw ?? 0),
          rebate: 0, // lastMonthCommission না থাকলে 0
          volume: team?.lastMonthSales ?? 0,
        };
      case "lastWeek":
      default:
        return { deposit: 0, withdraw: 0, netDeposit: 0, rebate: 0, volume: 0 };
    }
  };

  // Nicely formatted strings if you want
  const kpisText = {
    countOfReferring: String(kpis.countOfReferring),
    totalReferralIncome: fmt(kpis.totalReferralIncome),
    level1AiTradeBalance: fmt(kpis.level1AiTradeBalance),
    level1LiveTradeBalance: fmt(kpis.level1LiveTradeBalance),
  };

  return {
    team,
    levels,
    kpis,
    kpisText,
    getMetricsByRange,
    loading: isLoading || isFetching,
    isError,
    error,
  };
}
