import { sports } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "@/components/Reveal";
import { TodoText } from "@/components/Todo";

export function LuxeSports() {
  return (
    <SectionWrapper id="sports" className="bg-forest text-butter">
      <div className="max-w-2xl">
        <Reveal as="p" className="luxe-eyebrow text-brass-light">
          {sports.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          className="mt-6 font-serif text-4xl font-medium leading-tight tracking-tight text-butter sm:text-5xl"
        >
          {sports.heading}
        </Reveal>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {sports.cards.map((card, i) => (
          <Reveal key={card.name}>
            <article className="flex h-full flex-col border border-butter/15 p-8 transition-colors duration-500 hover:border-brass/60 sm:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-lg text-brass-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {card.lead && (
                  <span className="luxe-eyebrow text-[0.6rem] text-brass-light">
                    The lead sport
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-serif text-3xl font-medium text-butter">
                {card.name}
              </h3>
              <p className="mt-4 flex-grow font-luxe text-sm font-light leading-relaxed text-butter/65">
                {card.body}
              </p>
              <ul className="mt-7 space-y-3 border-t border-butter/10 pt-6">
                {card.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 font-luxe text-sm text-butter/80"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-brass-light" />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal as="p" className="mt-8 font-luxe text-xs uppercase tracking-[0.2em] text-butter/50">
        Courts — <TodoText>{sports.courtsNote}</TodoText>
      </Reveal>
    </SectionWrapper>
  );
}
