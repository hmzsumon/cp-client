// Central place to edit menu items
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  ChartCandlestick,
  Clock4,
  Download,
  Grid2x2,
  LifeBuoy,
  MessageSquare,
  Network,
  Settings,
  SquareGanttChart,
  Upload,
  Wallet,
} from "lucide-react";

export type NavChild = { label: string; sublabel?: string; href: string };
export type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: "new" | number;
  children?: NavChild[];
  section?: "default" | "bottom";
};

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: Grid2x2, href: "/dashboard" },
  {
    key: "accounts",
    label: "My Accounts",
    icon: ChartCandlestick,
    href: "/accounts",
  },
  {
    key: "ai-accounts",
    label: "Ai Accounts",
    icon: Bot,
    href: "/ai-accounts",
  },
  {
    key: "positions",
    label: "My Positions",
    icon: ChartCandlestick,

    children: [
      { label: "Open", href: "/positions" },

      {
        label: "Closed",
        href: "/closed-positions",
      },
    ],
  },
  { key: "deposit", label: "Deposit", icon: Download, href: "/deposit" },
  { key: "withdraw", label: "Withdraw", icon: Upload, href: "/withdraw" },
  {
    key: "wallet",
    label: "Wallet",
    icon: Wallet,

    children: [
      { label: "P2P", href: "/wallet/p2p" },
      {
        label: "Internal Transfer",
        href: "/wallet/transfer",
      },
    ],
  },
  {
    key: "history",
    label: "Transaction history",
    icon: Clock4,
    href: "/dashboard/history",
  },

  {
    key: "agent-zone",
    label: "Agent zone",
    icon: Network,

    children: [
      { label: "My referral", href: "/agent-zone/referral" },
      {
        label: "My clients",
        href: "/agent-zone/clients",
      },
    ],
  },

  {
    key: "settings",
    label: "Settings",
    icon: Settings,

    children: [
      { label: "Profile", href: "/settings/profile" },
      {
        label: "Security",
        href: "/settings/security",
      },
    ],
  },

  {
    key: "chat",
    label: "Live Chat",
    icon: MessageSquare,
    href: "/dashboard/chat",
    section: "bottom",
  },
  {
    key: "support",
    label: "Support",
    icon: LifeBuoy,
    href: "/dashboard/support",
  },
];

export const INVITE_CARD = {
  title: "Invite friends and earn money",
  icon: SquareGanttChart,
  href: "/dashboard/referrals",
};
