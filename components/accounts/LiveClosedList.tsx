"use client";

import { useSelectedAccount } from "@/hooks/useSelectedAccount";
import { useGetClosePositionsQuery } from "@/redux/features/trade/tradeApi";
import DayHeader from "../ai/positions/DayHeader";
import { Position } from "./types";

function groupClosedByDay(list: Position[]) {
  const map = new Map<string, Position[]>();
  for (const p of list) {
    const key = p.closedAt ? new Date(p.closedAt).toDateString() : "Unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return Array.from(map.entries()).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );
}

export default function ClosedList({ items }: { items: Position[] }) {
  const groups = groupClosedByDay(items);

  const { account } = useSelectedAccount();
  const accountId: string | undefined = account?._id;

  const { data, isLoading } = useGetClosePositionsQuery(
    { accountId: accountId!, status: "closed", limit: 500 },
    { skip: !accountId }
  );

  console.log(data);

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-400">
        No closed trades yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map(([day, list]) => (
        <div key={day}>
          <DayHeader date={new Date(day)} />
          <div className="space-y-2">
            {/* {list.map((p) => (
              <PositionRow key={p.id} p={p} closed />
            ))} */}
          </div>
        </div>
      ))}
    </div>
  );
}
