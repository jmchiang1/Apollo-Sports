import { programs } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { ProgramCard, type Tone } from "./ProgramCard";

// Cycle the icon-chip colors for a playful, varied grid.
const TONES: Tone[] = ["peach", "gold", "rose", "plum", "peach"];

export function ProgramsSection() {
  return (
    <SectionWrapper id="programs" className="bg-cream">
      <div className="max-w-2xl">
        <Reveal as="p" className="eyebrow">
          {programs.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]"
        >
          {programs.heading}
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.cards.map((card, i) => (
          <ProgramCard
            key={card.name}
            name={card.name}
            body={card.body}
            icon={card.icon}
            note={"note" in card ? card.note : undefined}
            tone={TONES[i % TONES.length]}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
