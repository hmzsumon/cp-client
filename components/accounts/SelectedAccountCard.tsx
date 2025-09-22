/* components/dashboard/SelectedAccountCard.tsx */
"use client";

import { useSelectedAccount } from "@/hooks/useSelectedAccount";
import AccountCard from "./AccountCard";
import NoAccountsCard from "./NoAccountsCard";

export default function SelectedAccountCard({
  onOpenPicker,
}: {
  onOpenPicker: () => void;
}) {
  const { account, loading } = useSelectedAccount();

  if (loading) {
    return (
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4">
        <div className="animate-pulse text-neutral-500">Loading account…</div>
      </div>
    );
  }

  if (!account) return <NoAccountsCard onOpen={onOpenPicker} />;

  return (
    <div>
      <AccountCard acc={account} />
      <div className="mt-3 flex justify-end">
        <button
          onClick={onOpenPicker}
          className="text-sm text-neutral-400 underline"
        >
          Switch account
        </button>
      </div>
    </div>
  );
}
