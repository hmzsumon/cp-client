"use client";

import { ChevronDown, Copy } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { INVITE_CARD, NAV_ITEMS } from "./sidebar-data";

type Props = { open: boolean; onClose: () => void };

export default function MobileSidebar({ open, onClose }: Props) {
  const [expand, setExpand] = useState<Record<string, boolean>>({});
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  // demo user/wallet
  const user = useMemo(
    () => ({ name: "H M ZAKARIA", email: "h****2@gmail.com" }),
    []
  );
  const wallet = useMemo(
    () => ({ id: "1182934804799179326", currency: "USD", amount: 0 }),
    []
  );

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(wallet.id);
    } catch {}
  };

  return (
    <>
      {/* Overlay (header-এর নিচ থেকে) */}
      <div
        className={`fixed inset-x-0 top-16 bottom-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer (header-এর নিচ থেকে শুরু) */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-50 w-[86%] max-w-[320px] border-r border-neutral-900 bg-neutral-950 transition-transform md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        {/* 📌 ব্র্যান্ড-হেডার/ক্লোজ বাটন বাদ (তোমার নির্দেশ অনুযায়ী) */}

        {/* তালিকা (স্ক্রল – স্ক্রলবার হাইড) */}
        <div className="h-full overflow-y-auto px-2 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* ▶️ User block */}
          <div className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 font-bold text-neutral-950">
                C
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {user.name}
                </div>
                <div className="text-xs text-neutral-400">{user.email}</div>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <Link
                href="/dashboard/settings/profile"
                onClick={onClose}
                className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-neutral-900"
              >
                <span>Settings</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  New
                </span>
              </Link>
              <Link
                href="/dashboard/settings/conditions"
                onClick={onClose}
                className="block rounded-lg px-2 py-2 text-sm hover:bg-neutral-900"
              >
                Trading conditions
              </Link>
              <button
                type="button"
                className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-neutral-900"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* ▶️ Balance accordion */}
          <div className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900/60">
            <button
              type="button"
              onClick={() => setBalanceOpen((s) => !s)}
              className="flex w-full items-center justify-between px-3 py-3 text-sm"
            >
              <span className="flex items-center gap-2 font-medium">
                <span className="inline-flex items-center rounded-md px-2 py-1 ring-1 ring-neutral-800">
                  {hideBalance
                    ? "••••"
                    : `${wallet.amount.toFixed(2)} ${wallet.currency}`}
                </span>
                <span className="text-neutral-400">Balance</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 transition ${
                  balanceOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {balanceOpen && (
              <div className="space-y-3 border-t border-neutral-800 p-3 pt-2">
                {/* toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-300">Hide balance</span>
                  <button
                    type="button"
                    onClick={() => setHideBalance((s) => !s)}
                    className={`relative h-5 w-9 rounded-full transition ${
                      hideBalance ? "bg-neutral-600" : "bg-neutral-700"
                    }`}
                    aria-pressed={hideBalance}
                  >
                    <span
                      className={`absolute top-[2px] h-4 w-4 rounded-full bg-white transition ${
                        hideBalance ? "right-[2px]" : "left-[2px]"
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <div className="text-lg font-semibold text-white">
                    {hideBalance
                      ? "••••"
                      : `${wallet.amount.toFixed(2)} ${wallet.currency}`}
                  </div>
                  <div className="text-xs text-neutral-400">
                    Investment wallet
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <code className="text-xs text-neutral-300">#{wallet.id}</code>
                  <button
                    type="button"
                    onClick={copyId}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ▶️ Main nav groups */}
          {NAV_ITEMS.filter((i) => i.section !== "bottom").map((i) => {
            const hasChildren = !!i.children?.length;
            const isOpen = !!expand[i.key];
            return (
              <div key={i.key}>
                <button
                  onClick={() =>
                    hasChildren
                      ? setExpand((s) => ({ ...s, [i.key]: !s[i.key] }))
                      : onClose()
                  }
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-neutral-900"
                >
                  <span className="flex items-center gap-3">
                    <i.icon className="h-5 w-5" />
                    {i.label}
                    {i.badge ? (
                      <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        {i.badge === "new" ? "New" : i.badge}
                      </span>
                    ) : null}
                  </span>
                  {hasChildren ? (
                    <ChevronDown
                      className={`h-4 w-4 transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  ) : null}
                </button>

                {hasChildren && isOpen && (
                  <div className="ml-9 space-y-1 py-1">
                    {i.children!.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        onClick={onClose}
                        className="block rounded-lg px-2 py-1.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white"
                      >
                        <span className="block">{c.label}</span>
                        {c.sublabel ? (
                          <span className="block text-xs text-neutral-400">
                            {c.sublabel}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* invite card */}
          <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <div className="text-sm font-medium">{INVITE_CARD.title}</div>
            <Link
              href={INVITE_CARD.href}
              onClick={onClose}
              className="mt-2 inline-flex rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-neutral-950"
            >
              Open
            </Link>
          </div>

          {/* bottom section */}
          <div className="mt-4 space-y-1">
            {NAV_ITEMS.filter((i) => i.section === "bottom").map((i) => (
              <Link
                key={i.key}
                href={i.href || "#"}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-neutral-900"
              >
                <i.icon className="h-5 w-5" />
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
