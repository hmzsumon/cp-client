// MyStakingScreen.tsx
"use client";

import { CalendarClock, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import EmptyState from "./EmptyState";
import PageTopBar from "./PageTopBar";
import StakingListItem, { StakingItem } from "./StakingListItem";
import StakingTabs, { StakingTabKey } from "./StakingTabs";
import SummaryCards, { SummaryCardItem, SummaryTone } from "./SummaryCards";

import {
  useGetMyStakingSubscriptionsQuery,
  useGetMyStakingSummaryQuery,
} from "@/redux/features/staking-earn/stakingEarnApi";

import { useMiniTickerMap } from "@/hooks/useMiniTickerMap"; // আপনার existing hook

const fmt = (n: number, max = 8) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: max });

function toneFromDiff(diff: number): SummaryTone {
  if (diff > 0) return "up";
  if (diff < 0) return "down";
  return "flat";
}

// ✅ normalize pair: XRPUSD -> XRPUSDT, BTC -> BTCUSDT, USDT -> USDT
function toUsdtPair(symbol?: string, asset?: string) {
  let s = String(symbol || "")
    .toUpperCase()
    .trim();
  const a = String(asset || "")
    .toUpperCase()
    .trim();

  if (s === "USDT" || a === "USDT") return "USDT";

  if (!s && a) s = a;

  // XRPUSD -> XRPUSDT (important)
  if (s.endsWith("USD")) s = s.replace(/USD$/, "USDT");

  // BTC -> BTCUSDT
  if (s && !s.endsWith("USDT")) s = `${s}USDT`;

  return s;
}

export default function MyStakingScreen() {
  const [tab, setTab] = useState<StakingTabKey>("active");

  const { data: subsData, isLoading: subsLoading } =
    useGetMyStakingSubscriptionsQuery();
  const { data: summaryData, isLoading: summaryLoading } =
    useGetMyStakingSummaryQuery();

  const subs = subsData?.items ?? [];
  const summaries = summaryData?.items ?? [];

  // ✅ collect pairs for prices (from summary + subs)
  const wantedPairs = useMemo(() => {
    const set = new Set<string>();

    for (const s of summaries as any[]) {
      const pair = toUsdtPair(s?.symbol, s?.asset);
      if (pair && pair !== "USDT") set.add(pair);
    }
    for (const s of subs as any[]) {
      const pair = toUsdtPair(s?.symbol, s?.asset);
      if (pair && pair !== "USDT") set.add(pair);
    }

    return Array.from(set).sort();
  }, [subs, summaries]);

  const prices = useMiniTickerMap(wantedPairs);

  const priceOfPair = (pair: string) => {
    if (pair === "USDT") return 1;
    return Number(prices[pair] || 0);
  };

  // ✅ LIVE totals in USDT
  const totals = useMemo(() => {
    const totalLockedUSDT = (summaries as any[]).reduce((acc, s) => {
      const qty = Number(s?.activePrincipalQty || 0);
      const pair = toUsdtPair(s?.symbol, s?.asset);
      const px = priceOfPair(pair);
      return acc + qty * (px || 0);
    }, 0);

    const totalProfitUSDT = (summaries as any[]).reduce((acc, s) => {
      const qty = Number(s?.totalProfitQty || 0);
      const pair = toUsdtPair(s?.symbol, s?.asset);
      const px = priceOfPair(pair);
      return acc + qty * (px || 0);
    }, 0);

    const activeCount = (summaries as any[]).reduce(
      (acc, s) => acc + Number(s?.activeCount || 0),
      0
    );

    const nextMaturity = (summaries as any[])
      .map((s) => s?.nextMaturityAt)
      .filter(Boolean)
      .sort()[0];

    return { totalLockedUSDT, totalProfitUSDT, activeCount, nextMaturity };
  }, [summaries, prices]);

  // ✅ StrictMode-safe flash state (useEffect)
  const [lockedTone, setLockedTone] = useState<SummaryTone>("flat");
  const [lockedFlash, setLockedFlash] = useState(false);
  const prevLockedRef = useRef<number | null>(null);

  const [earnedTone, setEarnedTone] = useState<SummaryTone>("flat");
  const [earnedFlash, setEarnedFlash] = useState(false);
  const prevEarnedRef = useRef<number | null>(null);

  useEffect(() => {
    const cur = totals.totalLockedUSDT;
    if (prevLockedRef.current == null) {
      prevLockedRef.current = cur;
      return;
    }
    const diff = cur - prevLockedRef.current;
    if (diff !== 0) {
      setLockedTone(toneFromDiff(diff));
      setLockedFlash(true);
      const t = setTimeout(() => setLockedFlash(false), 700);
      prevLockedRef.current = cur;
      return () => clearTimeout(t);
    }
    prevLockedRef.current = cur;
  }, [totals.totalLockedUSDT]);

  useEffect(() => {
    const cur = totals.totalProfitUSDT;
    if (prevEarnedRef.current == null) {
      prevEarnedRef.current = cur;
      return;
    }
    const diff = cur - prevEarnedRef.current;
    if (diff !== 0) {
      setEarnedTone(toneFromDiff(diff));
      setEarnedFlash(true);
      const t = setTimeout(() => setEarnedFlash(false), 700);
      prevEarnedRef.current = cur;
      return () => clearTimeout(t);
    }
    prevEarnedRef.current = cur;
  }, [totals.totalProfitUSDT]);

  // ✅ cards
  const cards: SummaryCardItem[] = useMemo(
    () => [
      {
        title: "Total Locked",
        value: `${fmt(totals.totalLockedUSDT, 2)} USDT`,
        icon: <Wallet className="h-4 w-4" />,
        tone: lockedTone,
        flash: lockedFlash,
      },
      {
        title: "Active",
        value: `${totals.activeCount}`,
        icon: <PiggyBank className="h-4 w-4" />,
        tone: "flat",
      },
      {
        title: "Earned",
        value: `${fmt(totals.totalProfitUSDT, 2)} USDT`,
        icon: <TrendingUp className="h-4 w-4" />,
        tone: earnedTone,
        flash: earnedFlash,
      },
      {
        title: "Next Maturity",
        value: totals.nextMaturity
          ? new Date(totals.nextMaturity).toLocaleDateString()
          : "—",
        icon: <CalendarClock className="h-4 w-4" />,
        tone: "flat",
      },
    ],
    [totals, lockedTone, lockedFlash, earnedTone, earnedFlash]
  );

  // ✅ list items
  const items: StakingItem[] = useMemo(() => {
    return subs.map((s: any) => {
      const totalDays = Number(s.termDays || 0);
      const paidDays = Number(s.paidDays || 0);
      const dailyPercent =
        totalDays > 0 ? Number(s.totalProfitPercent) / totalDays : 0;
      const progress = totalDays > 0 ? Math.min(1, paidDays / totalDays) : 0;

      const fullSymbol = toUsdtPair(s.symbol, s.asset); // normalize

      return {
        id: s._id,
        symbol: s.symbol?.replace("USDT", "") || s.asset || "—",
        fullSymbol,
        iconSrc: s.iconUrl,
        principalQty: Number(s.principalQty || 0),
        totalProfitPercent: Number(s.totalProfitPercent || 0),
        dailyPercent,
        earnedQty: Number(s.totalProfitQty || 0),
        status: s.status,
        startedAt: s.startedAt,
        endAt: s.endAt,
        paidDays,
        totalDays,
        progress,
      };
    });
  }, [subs]);

  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((x) => x.status === tab);
  }, [items, tab]);

  const loading = subsLoading || summaryLoading;

  return (
    <div className="min-h-screen text-white">
      <div className="pt-4">
        <PageTopBar title="My Staking" />
      </div>

      <div className="mt-5">
        <SummaryCards items={cards} loading={loading} />
      </div>

      <div className="mt-5">
        <StakingTabs value={tab} onChange={setTab} />
      </div>

      <div className="mt-4 pb-24">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {filtered.map((it) => (
              <StakingListItem key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
