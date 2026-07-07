import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { VisionSection } from "@/components/VisionSection";
import { SportsSection } from "@/components/SportsSection";
import { StatsBand } from "@/components/StatsBand";
import { ProgramsSection } from "@/components/ProgramsSection";
import { WhyUsGrid } from "@/components/WhyUsGrid";
import { LocationSection } from "@/components/LocationSection";
import { WaitlistSection } from "@/components/WaitlistSection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Marquee />
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
    </>
  );
}
