import { programs } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "@/components/Reveal";
import { TodoText } from "@/components/Todo";

export function LuxePrograms() {
  return (
    <SectionWrapper id="programs" className="bg-butter text-olive-ink">
      <div className="max-w-2xl">
        <Reveal as="p" className="luxe-eyebrow text-brass">
          {programs.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          className="mt-6 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl"
        >
          {programs.heading}
        </Reveal>
      </div>

      <div className="mt-14 border-t border-olive-ink/15">
        {programs.cards.map((card, i) => {
          const note = "note" in card ? card.note : undefined;
          return (
            <Reveal key={card.name}>
              <div className="group grid items-baseline gap-3 border-b border-olive-ink/15 py-8 md:grid-cols-[3rem_1fr] md:gap-10">
                <span className="font-serif text-2xl italic text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="font-serif text-2xl font-medium">{card.name}</h3>
                    {note && (
                      <span className="text-sm">
                        <TodoText>{note}</TodoText>
                      </span>
                    )}
                  </div>
                  <p className="mt-2 max-w-2xl font-luxe text-[0.97rem] font-light leading-relaxed text-olive-ink/70">
                    {card.body}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
