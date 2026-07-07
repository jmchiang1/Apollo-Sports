import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { VisionSection } from "@/components/VisionSection";
import { SportsSection } from "@/components/SportsSection";
import { StatsBand } from "@/components/StatsBand";
import { ProgramsSection } from "@/components/ProgramsSection";
import { WhyUsGrid } from "@/components/WhyUsGrid";
import { LocationSection } from "@/components/LocationSection";
import { WaitlistSection } from "@/components/WaitlistSection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Footer } from "@/components/Footer";

/** Version 1 — the playful, PKLYN-style site. */
export function SiteOriginal() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <VisionSection />
        <SportsSection />
        <StatsBand />
        <ProgramsSection />
        <WhyUsGrid />
        <LocationSection />
        <WaitlistSection />
        <FAQAccordion />
      </main>
      <Footer />
    </div>
  );
}
