/* ──────────────────────────────────────────────────────────────────────────
   AccountCard — shows single account (chips + balance + actions)
────────────────────────────────────────────────────────────────────────── */
import { IAccount } from "@/redux/features/account/accountApi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountCard({ acc }: { acc: IAccount }) {
  const router = useRouter();
  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          {acc.type.toUpperCase()} <span className="text-neutral-500">#</span>{" "}
          <span className="font-medium">{acc.accountNumber}</span>
        </div>
        <Link href="#" className="opacity-70">
          ›
        </Link>
      </div>

      {/* ── chips row ── */}
      <div className="mt-2 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-neutral-800">CGFX</span>
        <span className="px-2 py-1 rounded-full bg-neutral-800 capitalize">
          {acc.type}
        </span>
        {/* ✅ status নয়; mode দেখাই, closed হলে 'Closed' */}
        <span className="px-2 py-1 rounded-full bg-neutral-800">
          {acc.status !== "active"
            ? "Closed"
            : acc.mode === "demo"
            ? "Demo"
            : "Real"}
        </span>
      </div>

      <div className="mt-4 text-3xl font-semibold">
        {acc.balance.toFixed(2)} {acc.currency}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
        <Link
          href="/trade"
          className="rounded-full bg-yellow-400 text-black py-2 font-medium"
        >
          <button className="">Trade</button>
        </Link>
        <Link href="/transfer" className="w-full">
          <button className="rounded-full w-full bg-neutral-800 py-2">
            Transfer
          </button>
        </Link>
        <button className="rounded-full bg-neutral-800 py-2">Withdraw</button>
        <button className="rounded-full bg-neutral-800 py-2">Details</button>
      </div>
    </div>
  );
}
