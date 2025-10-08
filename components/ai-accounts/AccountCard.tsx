/* ──────────────────────────────────────────────────────────────────────────
   AccountCard — shows single account (chips + balance + actions)
────────────────────────────────────────────────────────────────────────── */

import { IAccount } from "@/redux/features/ai-account/ai-accountApi";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OpenAccountFab from "./OpenAccountFab";
import OpenAccountWizard from "./wizard/OpenAccountWizard";

export default function AccountCard({
  acc,
  onOpenPicker,
}: {
  acc: IAccount;
  onOpenPicker: () => void;
}) {
  const router = useRouter();
  const [openWizard, setOpenWizard] = useState(false);
  return (
    <div className="rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          {acc.mode.toUpperCase()} <span className="text-neutral-500">#</span>{" "}
          <span className="font-medium">{acc.accountNumber}</span>
        </div>
        {/* FABs */}
        <OpenAccountFab onClick={() => setOpenWizard(true)} />
      </div>

      {/* ── chips row ── */}
      <div className="mt-2 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded-lg bg-neutral-800">CGFX</span>
        <span className="px-2 py-1 rounded-lg bg-neutral-800 capitalize">
          {acc.mode}
        </span>
        <span className="px-2 py-1 rounded-lg capitalize bg-neutral-800">
          {acc.plan}
        </span>
      </div>

      <div className="mt-4 text-2xl font-semibold">
        {acc.balance.toFixed(2)} {acc.currency}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <Link href="/withdraw" className="w-full">
          <button className="rounded-lg w-full bg-neutral-800 py-2">
            Withdraw
          </button>
        </Link>

        <button
          className="rounded-lg w-full bg-neutral-800 py-2"
          onClick={onOpenPicker}
        >
          Switch account
        </button>

        <button className="rounded-lg bg-neutral-800 py-2">Details</button>
      </div>

      <OpenAccountWizard
        open={openWizard}
        onClose={() => setOpenWizard(false)}
      />
    </div>
  );
}
