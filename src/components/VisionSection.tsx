import { vision } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { DogPawing } from "./DogPawing";
import { PawPrint } from "./PawPrint";

export function VisionSection() {
  return (
    <SectionWrapper id="vision" className="relative overflow-hidden bg-rose">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* copy */}
        <div className="lg:col-span-7">
          <Reveal
            as="h2"
            className="font-display text-4xl font-extrabold leading-[1.0] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
          >
            {vision.heading}
          </Reveal>
          <div className="mt-7 max-w-xl space-y-5">
            {vision.paragraphs.map((p, i) => (
              <Reveal as="p" key={i} className="text-lg leading-relaxed text-ink/80">
                {p}
              </Reveal>
            ))}
          </div>
        </div>

        {/* mascot polaroid + founder quote */}
        <div className="relative lg:col-span-5">
          <Reveal>
            <div className="mx-auto max-w-xs rotate-[2.5deg] rounded-[2rem] border-2 border-plum/10 bg-cream p-4 shadow-[10px_10px_0_0_rgba(38,34,30,0.14)]">
              <div className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-peach">
                <div className="tex-dots absolute inset-0 text-plum/[0.09]" />
                <DogPawing className="relative h-44 w-auto text-plum" />
              </div>
              <p className="mt-3 text-center font-display text-sm font-bold text-ink">
                Apollo · Chief Morale Officer 🐾
              </p>
            </div>
          </Reveal>

          <Reveal>
            <figure className="relative z-10 mx-auto -mt-6 max-w-sm -rotate-2 rounded-2xl border-2 border-plum/10 bg-gold px-6 py-5 shadow-[6px_6px_0_0_rgba(38,34,30,0.16)]">
              <PawPrint className="mb-2 h-6 w-6 text-plum/70" />
              <blockquote className="font-display text-base font-bold leading-snug text-plum">
                {vision.founderNote}
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
