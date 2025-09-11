"use client";

/* ── Capitalice Home (TypeScript + modular components) ───────────────────────── */
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Clock,
  Globe2,
  Headphones,
  Lock,
  PlayCircle,
  Radio,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/* ── Shared UI / Utilities ───────────────────────────────────────────────────── */
interface ContainerProps {
  children?: ReactNode;
  className?: string;
}
const Container: React.FC<ContainerProps> = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

/* Polymorphic Button with `as` prop */
type ButtonBaseProps = {
  className?: string;
  icon?: LucideIcon;
  children?: ReactNode;
};

type ButtonProps<C extends ElementType> = ButtonBaseProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ButtonBaseProps | "as">;

function Button<C extends ElementType = "button">({
  as,
  className = "",
  icon: Icon,
  children,
  ...props
}: ButtonProps<C>) {
  const Comp = (as || "button") as ElementType;
  return (
    <Comp
      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm transition hover:opacity-90 active:scale-[.98] ${className}`}
      {...(props as object)}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{children}</span>
    </Comp>
  );
}

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}
const SectionTitle: React.FC<SectionTitleProps> = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
}) => (
  <div className={`mb-8 ${align === "left" ? "text-left" : "text-center"}`}>
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
        {eyebrow}
      </p>
    )}
    <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mx-auto mt-3 max-w-3xl text-sm text-neutral-300 sm:text-base">
        {subtitle}
      </p>
    )}
  </div>
);

interface CardProps {
  children?: ReactNode;
  className?: string;
}
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm backdrop-blur ${className}`}
  >
    {children}
  </div>
);

/* ── Navbar ──────────────────────────────────────────────────────────────────── */
const Navbar: React.FC = () => (
  <header className="sticky top-0 z-50 border-b border-neutral-900/60 bg-neutral-950/80 backdrop-blur">
    <Container className="flex h-16 items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-neutral-950 font-black">
          C
        </div>
        <span className="text-sm font-semibold tracking-wide text-white">
          Capitalise
        </span>
      </div>
      <nav className="hidden items-center gap-6 text-sm text-neutral-300 md:flex">
        <a href="#features" className="hover:text-white">
          Features
        </a>
        <a href="#markets" className="hover:text-white">
          Markets
        </a>
        <a href="#security" className="hover:text-white">
          Security
        </a>
        <a href="#podcast" className="hover:text-white">
          Podcast
        </a>
        <a href="#news" className="hover:text-white">
          Updates
        </a>
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/register-login">
          <Button className="border border-neutral-800 bg-neutral-900 text-neutral-200">
            Log in
          </Button>
        </Link>
        <Button
          as="a"
          href="#"
          className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950"
        >
          Register
        </Button>
      </div>
    </Container>
  </header>
);

/* ── Hero ────────────────────────────────────────────────────────────────────── */
const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-neutral-950">
    <Container className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
          Upgrade the way
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            {" "}
            you trade
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-neutral-300">
          Trade with a reliable platform and benefit from better-than-market
          conditions.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950">
            Start now
          </Button>
          <Button
            className="border border-neutral-800 bg-neutral-900 text-neutral-200"
            icon={PlayCircle}
          >
            Take a tour
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-neutral-400 sm:grid-cols-4">
          {[
            { icon: Zap, label: "Ultra-fast execution" },
            { icon: Headphones, label: "24/7 support" },
            { icon: Clock, label: "No overnight fees" },
            { icon: ShieldCheck, label: "Bank-grade security" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="mx-auto aspect-[9/18] w-72 rounded-[2.2rem] border border-neutral-800 bg-neutral-900 p-3 shadow-2xl sm:w-80">
          <div className="h-full w-full rounded-[1.6rem] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black"></div>
        </div>
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
    </Container>
  </section>
);

/* ── Highlights Bar ──────────────────────────────────────────────────────────── */
const HighlightsBar: React.FC = () => (
  <section className="border-y border-neutral-900 bg-neutral-950/60">
    <Container className="grid grid-cols-2 gap-6 py-6 text-sm text-neutral-300 sm:grid-cols-4">
      {[
        { icon: TrendingUp, label: "Tight spreads" },
        { icon: Globe2, label: "Global market access" },
        { icon: Smartphone, label: "Mobile first" },
        { icon: ShieldCheck, label: "Funds protection" },
      ].map((i, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <i.icon className="h-5 w-5 text-white" />
          <span>{i.label}</span>
        </div>
      ))}
    </Container>
  </section>
);

/* ── Features Grid ───────────────────────────────────────────────────────────── */
const FeaturesGrid: React.FC = () => (
  <section id="features" className="bg-neutral-950 py-14 sm:py-20">
    <Container>
      <SectionTitle
        eyebrow="Why Capitalice"
        title="Thrive in the gold, oil, indices, and crypto markets"
        subtitle="Fast, secure, and transparent execution to help you build an edge."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: Zap,
            title: "Instant withdrawals",
            desc: "Get your funds quickly with near‑instant processing.",
          },
          {
            icon: Lock,
            title: "Advanced security",
            desc: "Multi‑layer protection and segregated accounts.",
          },
          {
            icon: BarChart3,
            title: "Low spreads",
            desc: "Institutional‑grade pricing across 200+ instruments.",
          },
          {
            icon: Headphones,
            title: "24/7 support",
            desc: "Real humans, ready whenever you need help.",
          },
          {
            icon: Clock,
            title: "No overnight fees",
            desc: "Keep positions open with zero swap on select assets.",
          },
          {
            icon: Globe2,
            title: "Global liquidity",
            desc: "Deep liquidity from top‑tier providers.",
          },
        ].map((f, idx) => (
          <Card key={idx}>
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-neutral-800 p-3">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-neutral-300">{f.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

/* ── Markets Table ───────────────────────────────────────────────────────────── */
type MarketRow = {
  symbol: string;
  name: string;
  spread: string;
  execution: string;
  leverage: string;
  status: string;
};
const marketRows: MarketRow[] = [
  {
    symbol: "XAUUSD",
    name: "Gold",
    spread: "0.12",
    execution: "Market",
    leverage: "1:200",
    status: "Active",
  },
  {
    symbol: "USOIL",
    name: "Crude Oil",
    spread: "0.06",
    execution: "Market",
    leverage: "1:100",
    status: "Active",
  },
  {
    symbol: "BTCUSD",
    name: "Bitcoin",
    spread: "12.0",
    execution: "Instant",
    leverage: "1:20",
    status: "Active",
  },
  {
    symbol: "DE30",
    name: "DAX Index",
    spread: "0.8",
    execution: "Market",
    leverage: "1:50",
    status: "Active",
  },
  {
    symbol: "EURUSD",
    name: "Euro / USD",
    spread: "0.1",
    execution: "Instant",
    leverage: "1:500",
    status: "Active",
  },
];

const MarketsTable: React.FC = () => (
  <section id="markets" className="bg-neutral-950 pb-16">
    <Container>
      <SectionTitle
        title="Trade assets from global markets"
        subtitle="Explore the instruments you can trade on our platform."
      />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead className="bg-neutral-900/50 text-left text-xs uppercase tracking-widest text-neutral-400">
              <tr>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Spread</th>
                <th className="px-6 py-4">Execution</th>
                <th className="px-6 py-4">Leverage</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {marketRows.map((r) => (
                <tr key={r.symbol} className="text-sm text-neutral-200">
                  <td className="px-6 py-4 font-mono font-semibold text-white">
                    {r.symbol}
                  </td>
                  <td className="px-6 py-4">{r.name}</td>
                  <td className="px-6 py-4">{r.spread}</td>
                  <td className="px-6 py-4">{r.execution}</td>
                  <td className="px-6 py-4">{r.leverage}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="mt-5 flex items-center gap-3">
        <Button className="bg-neutral-900 text-neutral-200 ring-1 ring-inset ring-neutral-800">
          Try the demo
        </Button>
        <Button
          className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950"
          icon={ArrowRight}
        >
          Register
        </Button>
      </div>
    </Container>
  </section>
);

/* ── Opportunity Section ─────────────────────────────────────────────────────── */
const OpportunitySection: React.FC = () => (
  <section className="bg-neutral-950 py-14">
    <Container className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <Card className="p-0">
        <img
          src="https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=1600&auto=format&fit=crop"
          alt="Trading app screenshot"
          className="h-72 w-full rounded-2xl object-cover md:h-96"
        />
      </Card>
      <div>
        <SectionTitle
          align="left"
          title="Seize every opportunity"
          subtitle="Take on any market, on mobile or web, with micro‑lot flexibility."
        />
        <ul className="mt-4 grid grid-cols-1 gap-3 text-sm text-neutral-300 sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Micro & Standard accounts
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> One‑click trading
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Real‑time price alerts
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Rich charting tools
          </li>
        </ul>
      </div>
    </Container>
  </section>
);

/* ── Security Section ────────────────────────────────────────────────────────── */
const SecuritySection: React.FC = () => (
  <section id="security" className="bg-neutral-950 py-14">
    <Container className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <div>
        <SectionTitle
          align="left"
          eyebrow="Protection"
          title="Your security is our priority"
          subtitle="We maintain rigorous safeguards to ensure your personal and financial data stays protected."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { t: "2FA everywhere" },
            { t: "Encryption in transit & at rest" },
            { t: "Segregated client funds" },
            { t: "Real‑time risk monitoring" },
          ].map((i, idx) => (
            <Card key={idx}>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-4 w-4" />
                <p className="text-sm text-neutral-300">{i.t}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Card className="p-0">
        <img
          src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop"
          alt="Security engineer"
          className="h-72 w-full rounded-2xl object-cover md:h-96"
        />
      </Card>
    </Container>
  </section>
);

/* ── Podcast Promo ───────────────────────────────────────────────────────────── */
const PodcastPromo: React.FC = () => (
  <section
    id="podcast"
    className="relative overflow-hidden border-y border-neutral-900 bg-neutral-950 py-16"
  >
    <Container className="relative">
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Podcast
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            Capitalice — Born to Trade
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-neutral-300">
            Hear from pros on market psychology, building discipline, and
            staying prepared. Short, hands‑on episodes to keep you sharp.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950"
            icon={Radio}
          >
            Listen now
          </Button>
          <Button
            className="bg-neutral-900 text-neutral-200 ring-1 ring-inset ring-neutral-800"
            icon={PlayCircle}
          >
            Latest episode
          </Button>
        </div>
      </div>
    </Container>
  </section>
);

/* ── News Grid ───────────────────────────────────────────────────────────────── */
const NewsGrid: React.FC = () => (
  <section id="news" className="bg-neutral-950 py-16">
    <Container>
      <SectionTitle
        title="Keep up with Capitalice"
        subtitle="Stay tuned for product improvements, promotions, events, and updates."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "New: Markets you can trade, end‑to‑end",
            img: "https://images.unsplash.com/photo-1518186233392-c232efbf2373?q=80&w=1600&auto=format&fit=crop",
          },
          {
            title: "Capitalice Affiliate Guide & Program",
            img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop",
          },
          {
            title: "Instant withdrawals: fast and convenient processing",
            img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
          },
        ].map((n, idx) => (
          <Card key={idx} className="p-0">
            <img
              src={n.img}
              alt="news"
              className="h-44 w-full rounded-2xl object-cover"
            />
            <div className="p-5">
              <h4 className="font-semibold text-white">{n.title}</h4>
              <div className="mt-4">
                <Button
                  className="bg-neutral-900 text-neutral-200 ring-1 ring-inset ring-neutral-800"
                  icon={ArrowRight}
                >
                  Read more
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

/* ── CTA Section ─────────────────────────────────────────────────────────────── */
const CTASection: React.FC = () => (
  <section className="bg-neutral-950 pb-16">
    <Container>
      <Card className="flex flex-col items-center justify-between gap-6 border-0 bg-gradient-to-br from-neutral-900 to-black p-8 sm:flex-row">
        <div>
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            Trade with a trusted broker today
          </h3>
          <p className="mt-1 text-sm text-neutral-300">
            Start your journey with better‑than‑market conditions and 100+
            instruments.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-neutral-900 text-neutral-200 ring-1 ring-inset ring-neutral-800">
            Try the demo
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950"
            icon={ArrowRight}
          >
            Register
          </Button>
        </div>
      </Card>
    </Container>
  </section>
);

/* ── Footer ──────────────────────────────────────────────────────────────────── */
const Footer: React.FC = () => (
  <footer className="border-t border-neutral-900 bg-neutral-950 py-12 text-neutral-300">
    <Container>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:grid-cols-6">
        {[
          { h: "Accounts", l: ["Standard", "Zero", "Raw", "Demo"] },
          { h: "Markets", l: ["Forex", "Metals", "Energies", "Crypto"] },
          { h: "Platforms", l: ["Web", "iOS", "Android", "Desktop"] },
          { h: "Resources", l: ["Education", "Blog", "Status", "Affiliates"] },
          { h: "About", l: ["Company", "Careers", "Contact", "Legal"] },
          {
            h: "Support",
            l: ["Help center", "Security", "Report issue", "Community"],
          },
        ].map((c, i) => (
          <div key={i}>
            <h5 className="mb-3 text-sm font-semibold text-white">{c.h}</h5>
            <ul className="space-y-2 text-sm">
              {c.l.map((x) => (
                <li key={x}>
                  <a className="hover:text-white" href="#">
                    {x}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-neutral-900 pt-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-neutral-950 font-black">
            C
          </div>
          <span className="font-semibold text-white">Capitalice</span>
        </div>
        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} Capitalice. All rights reserved.
        </p>
      </div>
    </Container>
  </footer>
);

/* ── Page Assembly ───────────────────────────────────────────────────────────── */
export default function CapitaliceHome(): JSX.Element {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <Hero />
      <HighlightsBar />
      <FeaturesGrid />
      <MarketsTable />
      <OpportunitySection />
      <SecuritySection />
      <PodcastPromo />
      <NewsGrid />
      <CTASection />
      <Footer />
    </main>
  );
}
