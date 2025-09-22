/* ── Hero ───────────────────────────────────────────────────────────────────── */

import { Clock, Headphones, PlayCircle, ShieldCheck, Zap } from "lucide-react";
import React from "react";
import Button from "./Button";
import Container from "./Container";

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
          <div className="h-full w-full rounded-[1.6rem] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
        </div>
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
    </Container>
  </section>
);

export default Hero;
