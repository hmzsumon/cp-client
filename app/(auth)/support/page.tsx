// app/support/page.tsx
"use client";

import {
  BookOpen,
  LifeBuoy,
  Mail,
  MessageCircle,
  Phone,
  Shield,
} from "lucide-react";
import Link from "next/link";

const btnPrimary =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold " +
  "bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950 hover:opacity-90 transition";

const card =
  "rounded-xl border border-neutral-800 bg-neutral-900/60 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_10px_40px_-20px_rgba(0,0,0,0.6)]";

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-5xl px-3 py-6 text-white">
      {/* Hero */}
      <section className="mb-6 grid gap-4 md:grid-cols-[1.2fr_.8fr]">
        <div className={`${card} p-5`}>
          <h1 className="text-2xl font-extrabold tracking-tight">Need help?</h1>
          <p className="mt-1 text-neutral-300">
            We’re here to help with accounts, deposits & withdrawals, AI trade,
            and security.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link href="/faq" className={btnPrimary}>
              <BookOpen className="mr-2 h-4 w-4" />
              Browse FAQs
            </Link>
            <a
              href="mailto:support@capitalisegfx.com"
              className="rounded-lg border border-neutral-800 px-4 py-2 text-sm hover:bg-neutral-800"
            >
              <Mail className="mr-2 inline h-4 w-4" />
              Email support
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-neutral-400">
            <span className="inline-flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-neutral-300" /> 24/7 ticket
              support
            </span>
            <span className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-neutral-300" /> Account & security
              help
            </span>
          </div>
        </div>

        {/* Quick contact */}
        <div className={`${card} p-5`}>
          <h2 className="mb-3 text-lg font-semibold">Contact us</h2>
          <div className="space-y-3 text-sm">
            <a
              href="mailto:support@capitalisegfx.com"
              className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2 hover:bg-neutral-800/60"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-neutral-400">
                    support@capitalisegfx.com
                  </div>
                </div>
              </div>
              <span className="text-neutral-400">~12h avg</span>
            </a>

            <a
              href="https://t.me/capitalisegfx"
              target="_blank"
              className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2 hover:bg-neutral-800/60"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4" />
                <div>
                  <div className="font-medium">Telegram</div>
                  <div className="text-neutral-400">@capitalisegfx</div>
                </div>
              </div>
              <span className="text-neutral-400">Fast</span>
            </a>

            <div className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <div>
                  <div className="font-medium">Hotline</div>
                  <div className="text-neutral-400">Mon–Fri 10:00–18:00</div>
                </div>
              </div>
              <span className="text-neutral-400">Business hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick answers (from your Business Plan) */}
      <section className={`${card} p-5`}>
        <h2 className="mb-4 text-lg font-semibold">Quick answers</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">
              Minimum deposit (AI Trade)
            </div>
            <p className="text-sm text-neutral-300">
              To join AI Trade you need at least{" "}
              <span className="font-semibold">$30</span>. Regular deposit min
              can be lower.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">Withdraw rules</div>
            <p className="text-sm text-neutral-300">
              Network: <span className="font-semibold">TRC20</span>. Minimum
              withdraw <span className="font-semibold">$12</span>, fee{" "}
              <span className="font-semibold">5%</span>. User→User transfer min{" "}
              <span className="font-semibold">$5</span>.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">AI Trade profit sharing</div>
            <p className="text-sm text-neutral-300">
              You receive <span className="font-semibold">60%</span> of AI
              profit. Company receives{" "}
              <span className="font-semibold">40%</span>; from that flow, upline
              sharing applies (see below).
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">
              Upline commission levels
            </div>
            <p className="text-sm text-neutral-300">
              Five levels share: <span className="font-semibold">30%</span>,{" "}
              <span className="font-semibold">25%</span>,{" "}
              <span className="font-semibold">20%</span>,{" "}
              <span className="font-semibold">15%</span>,{" "}
              <span className="font-semibold">10%</span>.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">Refer bonus</div>
            <p className="text-sm text-neutral-300">
              Your referral earns a fixed bonus when downline starts AI Trade.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">Ranks & rewards</div>
            <p className="text-sm text-neutral-300">
              Bronze → Master ranks with increasing conditions and rewards.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Link href="/business-plan" className={btnPrimary}>
            Learn more
          </Link>
        </div>
      </section>

      {/* Submit a ticket */}
      <section className="mt-6">
        <form className={`${card} p-5 space-y-3`}>
          <h2 className="text-lg font-semibold">Submit a ticket</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none"
              placeholder="Your name"
            />
            <input
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none"
              placeholder="Email"
              type="email"
            />
          </div>
          <input
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none"
            placeholder="Subject"
          />
          <textarea
            className="min-h-[120px] w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none"
            placeholder="Describe your issue…"
          />
          <button type="submit" className={btnPrimary}>
            Send ticket
          </button>
        </form>
      </section>
    </main>
  );
}
