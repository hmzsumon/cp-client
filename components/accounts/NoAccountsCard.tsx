/* ──────────────────────────────────────────────────────────────────────────
   NoAccountsCard — matches your screenshot (Open / Restore)
────────────────────────────────────────────────────────────────────────── */
export default function NoAccountsCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="mt-4 rounded-2xl bg-neutral-900 border border-neutral-800 p-5">
      <div className="text-xl font-semibold">No active accounts</div>
      <div className="text-neutral-400 text-sm mt-1">
        Open a new account or restore an archived one.
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          className="flex flex-col items-center justify-center rounded-full bg-neutral-800 w-20 h-20 mx-auto"
          onClick={onOpen}
        >
          <span className="text-2xl">＋</span>
        </button>
        <button className="flex flex-col items-center justify-center rounded-full bg-neutral-800 w-20 h-20 mx-auto opacity-60 cursor-not-allowed">
          <span className="text-xl">▢</span>
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 text-center text-sm text-neutral-400">
        <div>Open account</div>
        <div>Restore</div>
      </div>
    </div>
  );
}
