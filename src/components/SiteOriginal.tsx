import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { VisionSection } from "@/components/VisionSection";
import { StatsBand } from "@/components/StatsBand";
import { ProgramsSection } from "@/components/ProgramsSection";
import { PricingSection } from "@/components/PricingSection";
import { LocationSection } from "@/components/LocationSection";
import { WaitlistSection } from "@/components/WaitlistSection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

/** Version 1 — the playful, PKLYN-style site. */
export function SiteOriginal() {
  return (
    <div className="site-shell">
      <Header />
      <main className="site-main">
        {/* Sports section now lives inside the Hero fly-over's final beat */}
        <Hero />
        <VisionSection />
        <StatsBand />
        <ProgramsSection />
        <PricingSection />
        <LocationSection />
        <WaitlistSection />
        <FAQAccordion />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
