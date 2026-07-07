import { waitlist } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { WaitlistForm } from "./WaitlistForm";
import { Shuttlecock } from "./Shuttlecock";
import { PickleballDot } from "./PickleballDot";
import { PawPrint } from "./PawPrint";

export function WaitlistSection() {
  return (
    <SectionWrapper id="waitlist" className="relative overflow-hidden bg-peach">
      {/* scattered motifs around the card */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Shuttlecock className="absolute left-[6%] top-[14%] h-12 w-12 rotate-[-16deg] text-peach-soft" />
        <PickleballDot className="absolute right-[8%] top-[20%] h-10 w-10 text-peach-soft" />
        <PawPrint className="absolute bottom-[12%] left-[10%] h-10 w-10 rotate-12 text-peach-soft" />
        <PawPrint className="absolute bottom-[16%] right-[9%] h-8 w-8 -rotate-12 text-peach-soft" />
      </div>

      <Reveal className="relative mx-auto max-w-3xl">
        <div className="relative rounded-[2.5rem] border-2 border-plum/10 bg-cream p-7 shadow-[12px_12px_0_0_rgba(56,40,44,0.16)] sm:p-12">
          <div className="text-center">
            <p className="eyebrow">{waitlist.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {waitlist.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">{waitlist.body}</p>
          </div>

          <div className="mx-auto mt-8 max-w-xl">
            <WaitlistForm />
          </div>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
