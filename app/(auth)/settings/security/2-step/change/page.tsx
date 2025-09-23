"use client";

import { useState } from "react";

/* ── radio row ────────────────────────────────────────────── */
function RadioRow({
  label,
  sub,
  recommended,
  value,
  selected,
  onChange,
}: {
  label: string;
  sub?: string;
  recommended?: boolean;
  value: string;
  selected: string;
  onChange: (v: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className="flex w-full items-center gap-3 border-b border-neutral-800/70 px-4 py-4 text-left last:border-b-0 hover:bg-neutral-900/40"
    >
      <span
        className={[
          "grid h-5 w-5 place-items-center rounded-full border",
          selected === value
            ? "border-emerald-500 ring-4 ring-emerald-500/20"
            : "border-neutral-600",
        ].join(" ")}
      >
        <span
          className={[
            "h-2.5 w-2.5 rounded-full",
            selected === value ? "bg-emerald-500" : "bg-transparent",
          ].join(" ")}
        />
      </span>

      <div className="flex-1">
        <div className="text-[15px] font-medium text-neutral-100">{label}</div>
        {sub ? <div className="text-sm text-neutral-400">{sub}</div> : null}
      </div>

      {recommended ? (
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
          Recommended
        </span>
      ) : null}
    </button>
  );
}

/* ── screen ───────────────────────────────────────────────── */
export default function TwoStepChangePage() {
  const [method, setMethod] = useState("phone-1");

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-8 pt-4">
      <h1 className="px-4 pb-1 text-3xl font-extrabold text-neutral-100">
        Change 2-Step verification
      </h1>
      <div className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40">
        <RadioRow
          label="Email"
          sub="z****m@gmail.com"
          value="email"
          selected={method}
          onChange={setMethod}
        />
        <RadioRow
          label="Phone"
          sub="+880****1155"
          value="phone-1"
          selected={method}
          onChange={setMethod}
        />
        <RadioRow
          label="Phone"
          sub="+880****4532"
          value="phone-2"
          selected={method}
          onChange={setMethod}
        />
      </div>

      <button
        disabled
        className="mx-4 block rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-center font-medium text-neutral-400"
      >
        Next
      </button>
    </div>
  );
}
