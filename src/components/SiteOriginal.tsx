import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StatsBand } from "@/components/StatsBand";
import { ProgramsSection } from "@/components/ProgramsSection";
import { MembershipSection, RatesSection } from "@/components/PricingSection";
import { WaitlistSection } from "@/components/WaitlistSection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Epigraph } from "@/components/Epigraph";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

/** Version 1 — the playful, PKLYN-style site. */
export function SiteOriginal() {
  return (
    <div className="site-shell">
      <Header />
      <main className="site-main">
        {/* Vision and Location are OFF the page — Vision was cut, and Location
            is out until there is an address to publish. Their components, copy
            and styles are all still in the repo; mounting them here is the only
            thing needed to bring either back. Location also needs its nav entry
            restored in siteConfig. */}
        <Hero />
        <StatsBand />
        <ProgramsSection />
        <MembershipSection />
        <RatesSection />
        <WaitlistSection />
        <FAQAccordion />
        <Epigraph />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
