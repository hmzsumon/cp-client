"use client";

import { formatBalance } from "@/lib/functions";
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  Menu,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CapitaliseLogo from "../branding/CapitaliseLogo";
import BalanceMenu from "./BalanceMenu";
import NotificationDrawer from "./NotificationDrawer";
import UserMenu from "./UserMenu";

/** Props DashboardLayout */
type Props = {
  open: boolean; // mobile sidebar state (Drawer)
  onToggle: () => void; // toggle mobile sidebar
};

export default function Header({ open, onToggle }: Props) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const { user } = useSelector((state: any) => state.auth);

  // ESC দিয়ে যে কোনো ওভারলে/পপওভার বন্ধ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setBalanceOpen(false);
        setUserOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ক্লিক-আউটসাইডে বন্ধ করার জন্য রেফারেন্স
  const balanceRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (balanceRef.current && !balanceRef.current.contains(t)) {
        setBalanceOpen(false);
      }
      if (userRef.current && !userRef.current.contains(t)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-neutral-900/60 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      {/* ফুল-উইডথ কন্টেইনার */}
      <div className="mx-auto flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: mobile menu + brand */}
        <div className="flex min-w-0 items-center gap-3">
          {/* মোবাইল: Drawer টগল (Menu ↔ X) */}
          <button
            className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white md:hidden"
            onClick={onToggle}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* ব্র্যান্ড / লোগো */}
          <div>
            <CapitaliseLogo
              variant="full"
              size={28}
              className="text-white"
              wordmarkClassName="text-white"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* ব্যাল্যান্স (ডেস্কটপে দেখাবে) */}
          <div ref={balanceRef} className="relative hidden md:block">
            <button
              onClick={() => {
                setBalanceOpen((v) => !v);
                setUserOpen(false);
                setNotifOpen(false);
              }}
              aria-haspopup="dialog"
              aria-expanded={balanceOpen}
              className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-neutral-200 hover:bg-neutral-900 ${
                balanceOpen ? "ring-1 ring-neutral-700" : ""
              }`}
            >
              <Wallet size={18} />
              <span className="font-semibold">
                {formatBalance(user?.m_balance ? user.m_balance : 0)}
                {}
              </span>
              <span className="text-neutral-400">USD</span>
              <ChevronDown size={14} className="text-neutral-400" />
            </button>
            <BalanceMenu open={balanceOpen} />
          </div>

          {/* নোটিফিকেশন : সব স্ক্রিনে */}
          <button
            className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
            onClick={() => {
              setNotifOpen(true);
              setUserOpen(false);
              setBalanceOpen(false);
            }}
            aria-haspopup="dialog"
            aria-expanded={notifOpen}
          >
            <Bell size={20} />
          </button>

          {/* ইউজার মেনু (ডেস্কটপে) */}
          <div ref={userRef} className="relative hidden md:block">
            <button
              onClick={() => {
                setUserOpen((v) => !v);
                setBalanceOpen(false);
                setNotifOpen(false);
              }}
              aria-haspopup="menu"
              aria-expanded={userOpen}
              className={`rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white ${
                userOpen ? "ring-1 ring-neutral-700" : ""
              }`}
            >
              <CircleUserRound size={20} />
            </button>
            <UserMenu open={userOpen} />
          </div>
        </div>
      </div>

      {/* রাইট-সাইড নোটিফিকেশন ড্রয়ার (header-এর নিচ থেকে শুরু) */}
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        topOffset={64}
      />
    </header>
  );
}
