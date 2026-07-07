import { waitlist } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "@/components/Reveal";
import { LuxeWaitlistForm } from "./LuxeWaitlistForm";

export function LuxeWaitlist() {
  return (
    <SectionWrapper id="waitlist" className="bg-forest text-butter">
      <div className="mx-auto max-w-xl text-center">
        <Reveal as="p" className="luxe-eyebrow text-brass-light">
          {waitlist.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          className="mt-6 font-serif text-4xl font-medium tracking-tight text-butter sm:text-5xl"
        >
          {waitlist.heading}
        </Reveal>
        <Reveal
          as="p"
          className="mt-5 font-luxe text-base font-light leading-relaxed text-butter/70"
        >
          {waitlist.body}
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-10 max-w-xl">
        <div className="border border-butter/15 p-8 sm:p-10">
          <LuxeWaitlistForm />
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
