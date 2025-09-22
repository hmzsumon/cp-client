"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronDown, Eye, EyeOff, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useRegisterUserMutation } from "@/redux/features/auth/authApi";
import { Button, Field, Input, Select } from "./UI";
import { countries, registerSchema, type RegisterValues } from "./schemas";

const Rule: React.FC<{ ok: boolean; children: React.ReactNode }> = ({
  ok,
  children,
}) => (
  <div
    className={`flex items-center gap-2 text-sm ${
      ok ? "text-emerald-500" : "text-red-500"
    }`}
  >
    {ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
    <span>{children}</span>
  </div>
);

const RegisterForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [show, setShow] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      country: "",
      email: "",
      password: "",
      partnerCode: "",
      notUSTaxPayer: false,
    },
  });

  const pwd = watch("password", "");
  const emailValue = watch("email", "");

  const pwdStats = useMemo(
    () => ({
      len: pwd.length >= 8 && pwd.length <= 15,
      lower: /[a-z]/.test(pwd),
      upper: /[A-Z]/.test(pwd),
      num: /\d/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    }),
    [pwd]
  );

  const submit = handleSubmit(async (values) => {
    const tId = toast.loading("Creating account...");
    try {
      const res = await registerUser(values).unwrap();
      toast.success("Account created", { id: tId });
      onSuccess?.();

      /* ── redirect to verify page with email ───────────────── */
      const email =
        (res?.email as string | undefined)?.toLowerCase?.() ||
        values.email.trim().toLowerCase();
      const qp = `email=${encodeURIComponent(email)}`;
      router.push(`/verify-email?${qp}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Registration failed", { id: tId });
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field
        label="Country / Region of residence"
        error={errors.country?.message}
      >
        <div className="relative">
          <Select {...register("country")}>
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
        </div>
      </Field>

      <Field label="Your email address" error={errors.email?.message}>
        <Input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          autoComplete="email"
        />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="pr-9"
            autoComplete="new-password"
          />
          <button
            type="button"
            aria-label="Toggle password"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-200"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="mt-2 space-y-1">
          <Rule ok={pwdStats.len}>Between 8-15 characters</Rule>
          <Rule ok={pwdStats.upper && pwdStats.lower}>
            At least one upper and one lower case letter
          </Rule>
          <Rule ok={pwdStats.num}>At least one number</Rule>
          <Rule ok={pwdStats.special}>At least one special character</Rule>
        </div>
      </Field>

      <details className="rounded-lg border border-neutral-800 p-3 open:bg-neutral-900/40">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-200">
          <span>Partner code (optional)</span>
          <ChevronDown size={16} />
        </summary>
        <div className="pt-3">
          <Input
            placeholder="Enter partner code"
            {...register("partnerCode")}
          />
        </div>
      </details>

      <label className="flex items-start gap-3 text-sm text-neutral-300">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border border-neutral-700 bg-neutral-900"
          {...register("notUSTaxPayer")}
        />
        <span>
          I declare and confirm that I am not a citizen or resident of the US
          for tax purposes.
        </span>
      </label>
      {errors.notUSTaxPayer?.message ? (
        <p className="-mt-2 text-sm text-red-500">
          {errors.notUSTaxPayer.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
