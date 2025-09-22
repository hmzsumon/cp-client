// Central place to edit menu items
import type { LucideIcon } from "lucide-react";
import {
  Clock4,
  Copy,
  Download,
  Grid2x2,
  HelpCircle,
  LifeBuoy,
  LineChart,
  MessageSquare,
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
  { key: "accounts", label: "My accounts", icon: Grid2x2, href: "/dashboard" },
  {
    key: "deposit",
    label: "Deposit",
    icon: Download,
    href: "/dashboard/deposit",
  },
  {
    key: "withdrawal",
    label: "Withdrawal",
    icon: Upload,
    href: "/dashboard/withdrawal",
  },
  {
    key: "history",
    label: "Transaction history",
    icon: Clock4,
    href: "/dashboard/history",
  },
  {
    key: "wallet",
    label: "Crypto wallet",
    icon: Wallet,
    href: "/dashboard/wallet",
  },

  {
    key: "analytics",
    label: "Analytics",
    icon: LineChart,
    children: [
      { label: "Analyst Views", href: "/dashboard/analytics/analyst-views" },
      { label: "Market News", href: "/dashboard/analytics/market-news" },
      {
        label: "Economic Calendar",
        sublabel: "Track major global events",
        href: "/dashboard/analytics/economic-calendar",
      },
    ],
  },

  { key: "copy", label: "Copy Trading", icon: Copy, href: "/dashboard/copy" },

  {
    key: "support",
    label: "Support hub",
    icon: LifeBuoy,
    href: "/dashboard/support",
    badge: "new",
  },

  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    badge: "new",
    children: [
      { label: "Profile", href: "/dashboard/settings/profile" },
      {
        label: "Security",
        href: "/dashboard/settings/security",
        sublabel: "New",
      },
      { label: "Trading Terminals", href: "/dashboard/settings/terminals" },
      { label: "Trading Conditions", href: "/dashboard/settings/conditions" },
      { label: "Virtual Private Server", href: "/dashboard/settings/vps" },
    ],
  },

  // bottom section
  {
    key: "chat",
    label: "Live Chat",
    icon: MessageSquare,
    href: "/dashboard/chat",
    section: "bottom",
  },
  {
    key: "products",
    label: "Exness Products",
    icon: SquareGanttChart,
    children: [
      { label: "Personal area", href: "#" },
      { label: "Exness terminal", href: "#" },
      { label: "Public website", href: "#" },
      { label: "Partnership", href: "#" },
    ],
    section: "bottom",
  },
  {
    key: "help",
    label: "Help",
    icon: HelpCircle,
    section: "bottom",
    href: "/dashboard/help",
  },
];

export const INVITE_CARD = {
  title: "Invite friends and earn money",
  icon: SquareGanttChart,
  href: "/dashboard/referrals",
};
