/* ── Capitalice Home (modular assembly) ─────────────────────────────────────── */

import CTASection from "@/components/public/CTASection";
import FeaturesGrid from "@/components/public/FeaturesGrid";
import Footer from "@/components/public/Footer";
import Hero from "@/components/public/Hero";
import HighlightsBar from "@/components/public/HighlightsBar";
import MarketsTable from "@/components/public/MarketsTable";
import Navbar from "@/components/public/Navbar";
import NewsGrid from "@/components/public/NewsGrid";
import OpportunitySection from "@/components/public/OpportunitySection";
import PodcastPromo from "@/components/public/PodcastPromo";
import SecuritySection from "@/components/public/SecuritySection";

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
