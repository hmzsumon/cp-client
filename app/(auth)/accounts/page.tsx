/* ──────────────────────────────────────────────────────────────────────────
   Accounts Page — container; list + wizard launcher (Exness-like)
────────────────────────────────────────────────────────────────────────── */
"use client";

import AccountCard from "@/components/accounts/AccountCard";
import AccountsTabs from "@/components/accounts/AccountsTabs";
import NoAccountsCard from "@/components/accounts/NoAccountsCard";
import OpenAccountFab from "@/components/accounts/OpenAccountFab";
import PromoCard from "@/components/accounts/PromoCard";
import OpenAccountWizard from "@/components/accounts/wizard/OpenAccountWizard";
import { useGetMyAccountsQuery } from "@/redux/features/account/accountApi";
import { useState } from "react";

export default function AccountsPage() {
  const { data, isLoading } = useGetMyAccountsQuery();
  const [openWizard, setOpenWizard] = useState(false);

  const items = data?.items ?? [];

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white">
      <div className="max-w-4xl mx-auto px-4 pb-24">
        {/* Header */}
        <div className="pt-6 pb-2">
          <h1 className="text-3xl font-bold">Accounts</h1>
        </div>

        {/* Promo banner */}
        <PromoCard />

        {/* No accounts / or list */}
        {isLoading ? (
          <div className="mt-6 rounded-xl bg-neutral-900 p-6">Loading...</div>
        ) : items.length === 0 ? (
          <NoAccountsCard onOpen={() => setOpenWizard(true)} />
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {items.map((acc) => (
                <AccountCard key={acc._id} acc={acc} />
              ))}
            </div>
          </>
        )}

        {/* Tabs (Open/Pending/Closed) — static for now */}
        <AccountsTabs />

        {/* Floating Action Button */}
        <OpenAccountFab onClick={() => setOpenWizard(true)} />

        {/* Wizard Modal */}
        <OpenAccountWizard
          open={openWizard}
          onClose={() => setOpenWizard(false)}
        />
      </div>
    </div>
  );
}
