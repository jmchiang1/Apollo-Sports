import { sports } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { SportCard } from "./SportCard";
import { TodoText } from "./Todo";
import { PickleballDot } from "./PickleballDot";

export function SportsSection() {
  return (
    <SectionWrapper id="sports" className="relative overflow-hidden bg-peach">
      {/* faint waffle texture */}
      <div
        aria-hidden
        className="tex-waffle pointer-events-none absolute inset-0 text-plum/[0.05]"
      />
      <PickleballDot
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-[8%] h-16 w-16 rotate-12 text-peach-soft"
      />

      <div className="relative">
        <div className="max-w-2xl">
          <Reveal as="p" className="eyebrow text-plum/60">
            {sports.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]"
          >
            {sports.heading}
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {sports.cards.map((card, i) => (
            <SportCard
              key={card.name}
              name={card.name}
              tagline={card.tagline}
              body={card.body}
              lead={card.lead}
              index={String(i + 1).padStart(2, "0")}
            />
          ))}
        </div>

        <Reveal as="p" className="mt-6 text-sm font-medium text-plum/70">
          Courts — <TodoText>{sports.courtsNote}</TodoText>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
