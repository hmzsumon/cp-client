/* ── Security Section ───────────────────────────────────────────────────────── */

import { ShieldCheck } from "lucide-react";
import React from "react";
import Card from "./Card";
import Container from "./Container";
import SectionTitle from "./SectionTitle";

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
            "2FA everywhere",
            "Encryption in transit & at rest",
            "Segregated client funds",
            "Real-time risk monitoring",
          ].map((t) => (
            <Card key={t}>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-4 w-4" />
                <p className="text-sm text-neutral-300">{t}</p>
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

export default SecuritySection;
