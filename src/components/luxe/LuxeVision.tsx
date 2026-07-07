import { vision } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "@/components/Reveal";

export function LuxeVision() {
  return (
    <SectionWrapper id="vision" className="bg-butter text-olive-ink">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal as="p" className="luxe-eyebrow text-brass">
            {vision.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            className="mt-6 font-serif text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl"
          >
            {vision.heading}
          </Reveal>
          <Reveal>
            <span className="mt-8 block h-px w-16 bg-brass/50" />
          </Reveal>
        </div>

        <div className="space-y-6">
          {vision.paragraphs.map((p, i) => (
            <Reveal
              as="p"
              key={i}
              className="font-luxe text-lg font-light leading-relaxed text-olive-ink/80"
            >
              {p}
            </Reveal>
          ))}
          <Reveal>
            <figure className="mt-8 border-l border-brass pl-6">
              <blockquote className="font-serif text-xl italic leading-snug text-olive-ink">
                {vision.founderNote}
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
