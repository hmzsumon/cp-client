// Central place to edit menu items
import type { LucideIcon } from "lucide-react";
import {
  ChartCandlestick,
  Clock4,
  Download,
  Grid2x2,
  LifeBuoy,
  MessageSquare,
  Settings,
  SquareGanttChart,
  Upload,
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
  { key: "accounts", label: "Dashboard", icon: Grid2x2, href: "/dashboard" },
  {
    key: "settings",
    label: "My Accounts",
    icon: ChartCandlestick,

    children: [
      { label: "Open", href: "/settings/profile" },
      {
        label: "Pending",
        href: "/settings/security",
      },
      {
        label: "Closed",
        href: "/settings/security",
      },
    ],
  },
  { key: "deposit", label: "Deposit", icon: Download, href: "/deposit" },
  { key: "withdraw", label: "Withdraw", icon: Upload, href: "/withdraw" },
  {
    key: "history",
    label: "Transaction history",
    icon: Clock4,
    href: "/dashboard/history",
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
