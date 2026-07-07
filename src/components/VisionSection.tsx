import { vision } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { PawPrint } from "./PawPrint";
import { Shuttlecock } from "./Shuttlecock";

export function VisionSection() {
  return (
    <SectionWrapper id="vision" className="relative overflow-hidden bg-rose">
      {/* decorative motifs */}
      <Shuttlecock
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-10 h-12 w-12 rotate-[24deg] text-rose-soft"
      />

      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Reveal as="p" className="eyebrow">
            {vision.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            className="mt-4 font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]"
          >
            {vision.heading}
          </Reveal>
        </div>

        <div className="space-y-6">
          {vision.paragraphs.map((p, i) => (
            <Reveal as="p" key={i} className="text-lg leading-relaxed text-ink/80">
              {p}
            </Reveal>
          ))}
          <Reveal>
            <figure className="mt-4 flex items-start gap-4 rounded-3xl border-2 border-plum/10 bg-cream p-6 shadow-[6px_6px_0_0_rgba(56,40,44,0.1)]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-plum">
                <PawPrint className="h-6 w-6" />
              </span>
              <blockquote className="font-display text-lg font-semibold leading-snug text-ink">
                {vision.founderNote}
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
