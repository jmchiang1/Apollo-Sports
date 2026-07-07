import { programs } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { DogRunning } from "./DogRunning";

export function ProgramsSection() {
  return (
    <SectionWrapper id="programs" className="relative overflow-hidden bg-cream">
      <DogRunning
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 hidden h-28 w-auto text-plum sm:block sm:h-32 lg:right-8"
      />
      <div className="max-w-2xl">
        <Reveal
          as="h2"
          className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[3rem]"
        >
          {programs.heading}
        </Reveal>
      </div>

      <div className="mt-12 border-t-2 border-plum/10">
        {programs.cards.map((card, i) => {
          const Icon = iconMap[card.icon as IconName];
          return (
            <Reveal key={card.name}>
              <div className="group flex items-center gap-5 border-b-2 border-plum/10 py-6 transition-colors duration-300 hover:bg-cream-2/60 sm:gap-8 sm:px-4">
                <span className="w-14 shrink-0 font-display text-4xl font-extrabold leading-none text-plum/20 transition-colors duration-300 group-hover:text-gold sm:w-24 sm:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
                    {card.name}
                  </h3>
                  <p className="mt-1.5 max-w-2xl leading-relaxed text-muted">
                    {card.body}
                  </p>
                </div>
                <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-plum text-gold transition-transform duration-300 group-hover:-rotate-6 sm:grid">
                  {Icon ? <Icon className="h-6 w-6" strokeWidth={2} /> : null}
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
