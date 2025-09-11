/* ── Capitalice Auth Kit (Next.js App Router, TypeScript, RTK Query, react-hot-toast) ── */

/* ── file: app/auth/page.tsx ─────────────────────────────────────────────────── */
"use client";

import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/redux/features/auth/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { z } from "zod";

/* ── helpers ─────────────────────────────────────────────────────────────────── */
const countries = [
  "Bangladesh",
  "India",
  "Pakistan",
  "United Arab Emirates",
  "Malaysia",
  "Singapore",
  "United Kingdom",
  "United States",
];

const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters")
  .max(15, "Must be at most 15 characters")
  .regex(/[a-z]/, "Include a lowercase letter")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/\d/, "Include a number")
  .regex(/[^A-Za-z0-9]/, "Include a special character");

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required"),
});

const registerSchema = z.object({
  country: z.string().min(1, "Required"),
  email: z.string().email(),
  password: passwordSchema,
  partnerCode: z.string().optional(),
  notUSTaxPayer: z.literal(true, {
    message: "Please confirm the declaration",
  }),
});

/* ── tiny UI primitives ──────────────────────────────────────────────────────── */
const Field: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
      {label}
    </label>
    {children}
    {error ? <p className="text-sm text-red-600">{error}</p> : null}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    {...props}
    className={`h-11 w-full rounded-lg border px-3 outline-none ring-0 transition placeholder:text-neutral-400 focus:border-neutral-800/80 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 ${
      props.className ?? ""
    }`}
  />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  props
) => (
  <select
    {...props}
    className={`h-11 w-full appearance-none rounded-lg border bg-white px-3 pr-10 text-left outline-none transition focus:border-neutral-800/80 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 ${
      props.className ?? ""
    }`}
  />
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className={`inline-flex h-11 items-center justify-center rounded-lg bg-yellow-400 px-5 text-sm font-semibold text-neutral-950 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 ${
      props.className ?? ""
    }`}
  >
    {children}
  </button>
);

const Pill: React.FC<{ ok: boolean; children: React.ReactNode }> = ({
  ok,
  children,
}) => (
  <div
    className={`flex items-center gap-2 text-sm ${
      ok ? "text-emerald-600" : "text-red-600"
    }`}
  >
    {ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
    <span>{children}</span>
  </div>
);

/* ── Sign In form ───────────────────────────────────────────────────────────── */
const SignInForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
  });

  const [show, setShow] = useState(false);

  const submit = handleSubmit(async (values) => {
    const tId = toast.loading("Signing in...");
    try {
      const res = await login(values).unwrap();
      //   dispatch(setCredentials(res));
      toast.success("Signed in", { id: tId });
      onSuccess?.();
      router.push("/");
    } catch (e: any) {
      toast.error(e?.data?.message || "Unable to sign in", { id: tId });
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Your email address" error={errors.email?.message}>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={16}
          />
          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="pl-9"
          />
        </div>
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={16}
          />
          <Input
            type={show ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="pl-9 pr-9"
          />
          <button
            type="button"
            aria-label="Toggle password"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-500 hover:text-neutral-700"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Loading..." : "Continue"}
      </Button>

      <div className="text-center text-sm text-neutral-500">
        Or sign in with
      </div>
      <Button
        type="button"
        className="w-full bg-neutral-100 text-neutral-900 hover:brightness-100"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" className="mr-2">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.8 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.6 16.2 18.9 14 24 14c3 0 5.8 1.1 7.9 3l5.7-5.7C33.8 6.1 29.1 4 24 4 16.1 4 9.2 8.3 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.2 0 9.9-2 13.4-5.3l-6.2-5.3C29.2 35.5 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9 39.6 15.9 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-4.9 6-9.3 6-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9 39.6 15.9 44 24 44c8.6 0 16-5.8 19.6-15.5 0-1.3.4-2.7.4-3.9z"
          />
        </svg>
        Google
      </Button>

      <div className="text-center text-sm">
        <Link href="#" className="text-neutral-700 underline">
          I forgot my password
        </Link>
      </div>
    </form>
  );
};

/* ── Register form ──────────────────────────────────────────────────────────── */
const RegisterForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [show, setShow] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const pwd = watch("password", "");
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
      //   dispatch(setCredentials(res));
      toast.success("Account created", { id: tId });
      onSuccess?.();
      router.push("/");
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
        />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="pr-9"
          />
          <button
            type="button"
            aria-label="Toggle password"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-500 hover:text-neutral-700"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="mt-2 space-y-1">
          <Pill ok={pwdStats.len}>Between 8-15 characters</Pill>
          <Pill ok={pwdStats.upper && pwdStats.lower}>
            At least one upper and one lower case letter
          </Pill>
          <Pill ok={pwdStats.num}>At least one number</Pill>
          <Pill ok={pwdStats.special}>At least one special character</Pill>
        </div>
      </Field>

      <details className="rounded-lg border p-3 open:bg-neutral-50">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
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

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border"
          {...register("notUSTaxPayer")}
        />
        <span>
          I declare and confirm that I am not a citizen or resident of the US
          for tax purposes.
        </span>
      </label>
      {errors.notUSTaxPayer?.message ? (
        <p className="-mt-2 text-sm text-red-600">
          {errors.notUSTaxPayer.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create account"}
      </Button>
    </form>
  );
};

/* ── Page wrapper with tabs ─────────────────────────────────────────────────── */
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`relative h-10 px-4 text-sm font-medium ${
      active ? "text-neutral-900" : "text-neutral-500"
    }`}
  >
    {children}
    <span
      className={`absolute left-0 top-full block h-[2px] w-full rounded bg-neutral-900 transition ${
        active ? "opacity-100" : "opacity-0"
      }`}
    ></span>
  </button>
);

export default function AuthPage(): JSX.Element {
  const [tab, setTab] = useState<"signin" | "create">("signin");

  return (
    <main className="min-h-[100dvh] bg-white">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Shield size={20} /> Capitalice
          </div>
          <div className="text-sm text-neutral-500">Support</div>
        </div>
      </header>

      <section className="mx-auto max-w-xl px-4 py-10">
        <h1 className="mb-6 text-center text-3xl font-extrabold tracking-tight">
          Welcome to Capitalice
        </h1>

        <div className="mb-6 flex justify-center gap-8">
          <TabButton active={tab === "signin"} onClick={() => setTab("signin")}>
            Sign in
          </TabButton>
          <TabButton active={tab === "create"} onClick={() => setTab("create")}>
            Create an account
          </TabButton>
        </div>

        <div className="rounded-2xl border p-6 shadow-sm">
          {tab === "signin" ? (
            <SignInForm onSuccess={() => setTab("signin")} />
          ) : (
            <RegisterForm onSuccess={() => setTab("signin")} />
          )}
        </div>
      </section>
    </main>
  );
}

/* ── Installation notes ─────────────────────────────────────────────────────── */
// npm i @reduxjs/toolkit react-redux react-hot-toast zod @hookform/resolvers react-hook-form lucide-react
// Add <Providers> wrapper in app/layout.tsx (see file above).
// Set NEXT_PUBLIC_API_URL in .env if needed.
