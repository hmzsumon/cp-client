import DashboardShell from "@/components/auth/Layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capitalise — Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
