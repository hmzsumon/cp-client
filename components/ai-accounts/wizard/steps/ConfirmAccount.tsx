/* ===========================================================
   FILE: app/components/steps/ConfirmAccount.tsx
   DESC: Step 2 — preview chosen plan & confirm (toast on success/error)
=========================================================== */
"use client";

import { useCreateAiAccountMutation } from "@/redux/features/ai-account/ai-accountApi";
import { useMemo } from "react";
import toast from "react-hot-toast";
import type { WizardState } from "../OpenAccountWizard";
import { PLANS } from "./PlanCarousel";

export default function ConfirmAccount({
  state,
  onBack,
  onConfirm,
}: {
  state: WizardState;
  onBack: () => void;
  onConfirm: () => void; // called after successful API
}) {
  const [createAccount, { isLoading }] = useCreateAiAccountMutation();

  const plan = useMemo(
    () => PLANS.find((p) => p.key === state.type)!,
    [state.type]
  );

  // Helper: extract readable error message from RTK Query error shapes
  function getErrorMessage(err: unknown): string {
    if (typeof err === "string") return err;
    if (err && typeof err === "object") {
      const e = err as any;
      // fetchBaseQuery error: { status, data }
      if ("data" in e && e.data) {
        if (typeof e.data === "string") return e.data;
        if (typeof e.data?.message === "string") return e.data.message;
        try {
          return JSON.stringify(e.data);
        } catch {
          /* ignore */
        }
      }
      if ("error" in e && typeof e.error === "string") return e.error;
      if ("message" in e && typeof e.message === "string") return e.message;
      if ("status" in e) return `Request failed (${e.status})`;
    }
    return "Something went wrong. Please try again.";
  }

  const submitHandler = async () => {
    const payload = {
      plan: state.type,
      currency: state.currency,
      mode: state.mode,
      amount: state.amount,
    };

    try {
      const res = await toast.promise(createAccount(payload).unwrap(), {
        loading: "Creating account...",
        success: "Account created successfully",
        error: (err) => getErrorMessage(err),
      });

      // যদি API কোনো success ফ্ল্যাগ দেয়, সেটা দেখে কনফার্ম কল করুন
      if (
        !res ||
        (typeof res === "object" && "success" in res && !res.success)
      ) {
        // সফল মেসেজ দেখানো হলেও সার্ভার ফ্ল্যাগ মিসম্যাচ হলে সতর্কতা
        toast.error("The server did not confirm success.");
        return;
      }

      onConfirm();
    } catch (err) {
      // toast.promise ইতিমধ্যেই এরর দেখিয়েছে; চাইলে আরও লগ করতে পারেন
      console.error("Account creation failed:", err);
    }
  };

  return (
    <div className="p-4">
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4">
        <div className="text-lg font-semibold">Review & confirm</div>

        <div className="mt-3 rounded-xl border border-neutral-800">
          <div className="p-4 border-b border-neutral-800">
            <div className="text-xl font-bold">{plan.title}</div>
            <div className="text-xs text-neutral-400 mt-1">{plan.subtitle}</div>
          </div>

          <div className="p-4 space-y-2 text-sm">
            {plan.rows.map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between border-b border-neutral-800 py-1"
              >
                <div className="text-neutral-400">{k}</div>
                <div>{v}</div>
              </div>
            ))}
            <div className="flex justify-between py-1">
              <div className="text-neutral-400">Currency</div>
              <div>{state.currency}</div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-neutral-400">Amount</div>
              <div>
                {state.amount} {state.currency}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 py-3 rounded-xl border border-neutral-800"
            onClick={onBack}
          >
            Back
          </button>
          <button
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-yellow-400 text-black font-semibold disabled:opacity-50"
            onClick={submitHandler}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
