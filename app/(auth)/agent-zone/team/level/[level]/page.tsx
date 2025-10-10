// app/(agent)/agent/team/level/[level]/page.tsx
"use client";

/* ────────── imports ────────── */
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

/* ────────── API hook: তুমি তোমার redux api-তে বানাবে ──────────
   উদাহরণ সিগনেচার:
   useGetTeamUsersByLevelQuery({ level: number })
*/
import { useGetTeamUsersByLevelQuery } from "@/redux/features/auth/authApi";

/* ────────── types (sample, adjust to your API) ────────── */
type TeamUser = {
  _id: string;
  customerId: string;
  name: string;
  email?: string;
  phone?: string;
  deposit?: number;
  activeDeposit?: number;
  status?: "active" | "inactive";
  joinedAt?: string;
};

export default function TeamLevelPage() {
  const params = useParams<{ level: string }>();
  const level = Number(params.level);

  const { data, isLoading } = useGetTeamUsersByLevelQuery({ level });
  const users: TeamUser[] = data?.users ?? [];

  const columns: GridColDef<TeamUser>[] = [
    { field: "customerId", headerName: "Customer ID", width: 140 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 140 },
    {
      field: "deposit",
      headerName: "Deposit",
      width: 120,
      renderCell: (p) =>
        Number(p.row.deposit ?? 0).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      field: "activeDeposit",
      headerName: "Active",
      width: 120,
      renderCell: (p) =>
        Number(p.row.activeDeposit ?? 0).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (p) => (
        <span
          className={
            p.row.status === "active"
              ? "rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-400"
              : "rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-xs text-rose-400"
          }
        >
          {p.row.status ?? "-"}
        </span>
      ),
    },
    {
      field: "joinedAt",
      headerName: "Joined",
      width: 160,
      renderCell: (p) =>
        p.row.joinedAt
          ? new Date(p.row.joinedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      field: "view",
      headerName: "",
      width: 70,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (p) => (
        <Link
          href={`/users/${p.row._id}`}
          className="text-teal-300 hover:underline"
        >
          View
        </Link>
      ),
    },
  ];

  const rows = useMemo(() => users.map((u) => ({ id: u._id, ...u })), [users]);

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#E6E6E6]">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Level {level} Users
            <span className="ml-2 text-white/60">({users.length})</span>
          </h2>
          <Link
            href="/agent-zone/clients"
            className="text-sm text-teal-300 hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            disableRowSelectionOnClick
            columnHeaderHeight={44}
            getRowHeight={() => 56}
            sx={{
              bgcolor: "#0E1014",
              color: "#E6E6E6",
              border: "1px solid rgba(255,255,255,0.08)",
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 12,
              },
              "& .MuiDataGrid-cell": {
                borderColor: "rgba(255,255,255,0.06)",
                fontSize: 12,
              },
              "& .MuiDataGrid-row:hover": { bgcolor: "rgba(255,255,255,0.03)" },
              "& .MuiTablePagination-root": { color: "rgba(255,255,255,0.75)" },
            }}
          />
        </div>
      </div>
    </main>
  );
}
