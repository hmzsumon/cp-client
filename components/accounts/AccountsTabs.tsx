/* ──────────────────────────────────────────────────────────────────────────
   AccountsTabs — Open / Pending / Closed (visual only)
────────────────────────────────────────────────────────────────────────── */
export default function AccountsTabs() {
  return (
    <div className="mt-6 border-b border-neutral-800">
      <div className="flex gap-6 text-sm">
        <button className="pb-3 border-b-2 border-white">Open</button>
        <button className="pb-3 text-neutral-400">Pending</button>
        <button className="pb-3 text-neutral-400">Closed</button>
      </div>
    </div>
  );
}
