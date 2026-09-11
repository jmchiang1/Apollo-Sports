import { Hero } from "@/components/Hero";
import { StatsBand } from "@/components/StatsBand";
import { WaitlistSection } from "@/components/WaitlistSection";
import { Epigraph } from "@/components/Epigraph";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

/**
 * Version 1 — the pre-launch page.
 *
 * WHY THIS IS SO SHORT. Visitors were landing here and believing the club
 * already existed, then presumably trying to book. The cause was not one line
 * of copy, it was the shape of the page: membership tiers with "Join Now"
 * buttons, peak and off-peak court rates, six programs written in the
 * imperative ("Show up, get matched, play"), and an operational FAQ. Every one
 * of those is the furniture of a business you can transact with today. No
 * amount of "coming soon" above them outweighs a price list below them.
 *
 * So the page is now: what it is, when it opens, and one thing to do about it.
 *
 * NO HEADER BAR. With every section unmounted there is nothing to navigate
 * to, so a bar carrying an empty nav and a duplicate of the hero's own button
 * was pure chrome. The wordmark moved into the centre of the hero instead, the
 * way a pre-launch page usually carries it. Header.tsx is untouched and still
 * builds; mounting it here brings the bar back, and it needs `nav` repopulated
 * to be worth anything.
 *
 * OFF THE PAGE, all still in the repo and all still building:
 *   Header · ProgramsSection · MembershipSection · RatesSection · FAQAccordion
 *   VisionSection (cut earlier) · LocationSection (no address yet)
 *
 * Mounting any of them here is the only thing needed to bring them back, plus
 * restoring its `nav` entry in siteConfig. Bring the pricing back only once
 * memberships can actually be bought, or it will recreate exactly this problem.
 */
export function SiteOriginal() {
  return (
    <div className="site-shell">
      <main className="site-main">
        <Hero />
        <StatsBand />
        <WaitlistSection />
        <Epigraph />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
