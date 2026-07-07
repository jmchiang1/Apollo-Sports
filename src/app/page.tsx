import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { VisionSection } from "@/components/VisionSection";
import { SportsSection } from "@/components/SportsSection";
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
        <VisionSection />
        <SportsSection />
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
