/* ── Capitalice Home (modular assembly) ─────────────────────────────────────── */

import CTASection from "@/components/public/CTASection";
import FeaturesGrid from "@/components/public/FeaturesGrid";
import Hero from "@/components/public/Hero";
import HighlightsBar from "@/components/public/HighlightsBar";
import MarketsTable from "@/components/public/MarketsTable";
import NewsGrid from "@/components/public/NewsGrid";
import OpportunitySection from "@/components/public/OpportunitySection";
import PodcastPromo from "@/components/public/PodcastPromo";
import SecuritySection from "@/components/public/SecuritySection";
import PublicLayout from "./(public)/layout";

export default function CapitaliceHome(): JSX.Element {
  return (
    <PublicLayout>
      <Hero />
      <HighlightsBar />
      <FeaturesGrid />
      <MarketsTable />
      <OpportunitySection />
      <SecuritySection />
      <PodcastPromo />
      <NewsGrid />
      <CTASection />
    </PublicLayout>
  );
}
