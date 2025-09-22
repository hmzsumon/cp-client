"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { useVerifyEmailMutation } from "@/redux/features/auth/authApi";
import { Button, Field, Input } from "./UI";

// ── schema ────────────────────────────────────────────────────
export const verifyEmailSchema = z.object({
  email: z.string().email("Enter a valid email"),
  code: z
    .string()
    .min(4, "Code must be at least 4 characters")
    .max(8, "Code must be at most 8 characters"),
});

export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;

// ── component ─────────────────────────────────────────────────
const VerifyEmailForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const router = useRouter();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    mode: "onTouched",
    defaultValues: { email: "", code: "" },
  });

  const submit = handleSubmit(async (values) => {
    const tId = toast.loading("Verifying email...");
    try {
      const res = await verifyEmail(values).unwrap();
      toast.success(res?.message || "Email verified", { id: tId });
      onSuccess?.();
      router.push("/register-login");
    } catch (e: any) {
      toast.error(e?.data?.message || "Verification failed", { id: tId });
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* ── email field ──────────────────────────────────────── */}
      <Field label="Email address" error={errors.email?.message}>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={16}
          />
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            className="pl-9"
          />
        </div>
      </Field>

      {/* ── verification code field ──────────────────────────── */}
      <Field label="Verification code" error={errors.code?.message}>
        <div className="relative">
          <ShieldCheck
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={16}
          />
          <Input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            {...register("code")}
            className="pl-9 tracking-widest"
          />
        </div>
      </Field>

      {/* ── submit ───────────────────────────────────────────── */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Verifying..." : "Verify Email"}
      </Button>
    </form>
  );
};

export default VerifyEmailForm;
