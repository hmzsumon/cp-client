// FILE: components/dashboard/RecentActivityItem.tsx
"use client";
import type { Activity } from "@/types/dashboard";
import { ArrowUpRight } from "lucide-react";
export function RecentActivityItem({ activity }: { activity: Activity }) {
  const isPositive = activity.amount >= 0;
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40">
          <ArrowUpRight className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-medium">{activity.title}</div>
          <div className="text-[11px] text-white/50">{activity.date}</div>
        </div>
      </div>
      <div
        className={`text-sm font-semibold ${
          isPositive ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {isPositive ? "+" : ""}
        {activity.amount.toFixed(2)} {activity.currency ?? "USD"}
      </div>
    </div>
  );
}
