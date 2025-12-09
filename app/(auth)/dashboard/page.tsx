// FILE: app/dashboard/page.tsx

"use client";

/* ── imports ─────────────────────────────────────────────────────────────── */
import LinkButton from "@/components/dashboard/LinkButton";
import WalletTabs from "@/components/dashboard/WalletTabs";
import { useGetDashboardQuery } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";

const InlineSpinner: React.FC = () => (
  <span className="inline-flex h-4 w-4 items-center justify-center align-middle">
    <span className="relative block h-4 w-4">
      <span className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-emerald-400 via-cyan-500 to-emerald-400" />
      <span className="absolute inset-[2px] rounded-full bg-neutral-950" />
    </span>
  </span>
);

/* ── tiny utils ──────────────────────────────────────────────────────────── */
const toAmt = (n: unknown) => {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? Number(v.toFixed(2)) : 0;
};

export default function DashboardPage() {
  const { user } = useSelector((state: any) => state.auth);
  const { data, isLoading, isError } = useGetDashboardQuery(undefined);

  const balance = user?.m_balance ?? 0;

  /* ── ui ───────────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen w-full bg-[#0b0e11] pb-24 text-white   pt-6">
      <div className="space-y-6 mb-8">
        {/* ── Start balances section ───── */}
        <div className="space-y-2">
          <p className="text-sm text-neutral-400">Main balance</p>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
            {isLoading ? (
              <InlineSpinner />
            ) : (
              <span>
                {typeof balance === "number" ? balance.toFixed(4) : balance}
              </span>
            )}
            {!isLoading && (
              <span className="ml-1 text-sm text-neutral-400">USDT</span>
            )}
          </div>
        </div>
        {/* ── End balances section ───── */}
        {/* ── Start Link buttons section ───── */}
        <div className="grid grid-cols-3 gap-4 ">
          <LinkButton href="/deposit" variant="primary">
            Add Funds
          </LinkButton>

          <LinkButton href="/wallet/p2p" variant="secondary">
            Send
          </LinkButton>

          <LinkButton href="/transfer" variant="secondary">
            Transfer
          </LinkButton>
        </div>
        {/* ── End Link buttons section ───── */}
        {/* ── Start  Wallet Tab section ───── */}
        <div>
          <WalletTabs />
        </div>
        {/* ── End  Wallet Tab section ───── */}
      </div>
    </main>
  );
}
