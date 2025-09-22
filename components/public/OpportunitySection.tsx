/* ── Opportunity Section ────────────────────────────────────────────────────── */

import { ShieldCheck } from "lucide-react";
import React from "react";
import Card from "./Card";
import Container from "./Container";
import SectionTitle from "./SectionTitle";

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
          subtitle="Take on any market, on mobile or web, with micro-lot flexibility."
        />
        <ul className="mt-4 grid grid-cols-1 gap-3 text-sm text-neutral-300 sm:grid-cols-2">
          {[
            "Micro & Standard accounts",
            "One-click trading",
            "Real-time price alerts",
            "Rich charting tools",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default OpportunitySection;
