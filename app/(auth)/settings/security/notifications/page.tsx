"use client";

import Row from "@/components/settings/Row";

/* ── checkbox row (simple) ────────────────────────────────── */
function Tick({ checked }: { checked?: boolean }) {
  return (
    <span
      className={[
        "inline-flex h-5 w-5 items-center justify-center rounded-md border",
        checked
          ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
          : "border-neutral-700 text-transparent",
      ].join(" ")}
    >
      ✓
    </span>
  );
}

/* ── Notifications screen ─────────────────────────────────── */
export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl pb-8 pt-4">
      <h1 className="px-4 pb-2 text-2xl font-bold text-neutral-100">
        Notifications
      </h1>
      <p className="px-4 text-sm text-neutral-400">
        Notifications are sent for Favorites instruments.
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40">
        <Row href="#" title="Instruments" subtitle="Favorites" />
        <Row title="Trading signals" end={<Tick checked />} />
        <Row title="News" end={<Tick checked />} />
        <Row title="Economic calendar" end={<Tick checked />} />
        <Row title="Price movements" end={<Tick checked />} />

        <div className="border-t border-neutral-800/70 px-4 py-3 text-sm font-semibold text-neutral-300">
          Operations
        </div>
        <Row title="Trading" end={<Tick checked />} />
        <Row title="Financial" end={<Tick checked />} />
      </div>
    </div>
  );
}
