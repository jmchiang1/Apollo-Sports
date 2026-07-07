import { programs } from "@/config/siteConfig";
import { cn } from "@/lib/cn";
import { SectionWrapper, Reveal } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { TodoText } from "./Todo";

const TONES = [
  "bg-peach text-plum",
  "bg-gold text-plum",
  "bg-rose text-plum",
  "bg-plum text-gold",
  "bg-peach text-plum",
];

export function ProgramsSection() {
  return (
    <SectionWrapper id="programs" className="bg-cream">
      <div className="max-w-2xl">
        <Reveal as="p" className="eyebrow">
          {programs.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[3rem]"
        >
          {programs.heading}
        </Reveal>
      </div>

      <div className="mt-12 border-t-2 border-plum/10">
        {programs.cards.map((card, i) => {
          const Icon = iconMap[card.icon as IconName];
          const note = "note" in card ? card.note : undefined;
          return (
            <Reveal key={card.name}>
              <div className="group flex items-center gap-5 border-b-2 border-plum/10 py-6 transition-colors duration-300 hover:bg-cream-2/60 sm:gap-8 sm:px-4">
                <span className="w-14 shrink-0 font-display text-4xl font-extrabold leading-none text-plum/20 transition-colors duration-300 group-hover:text-gold sm:w-24 sm:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
                      {card.name}
                    </h3>
                    {note && (
                      <span className="text-sm">
                        <TodoText>{note}</TodoText>
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 max-w-2xl leading-relaxed text-muted">
                    {card.body}
                  </p>
                </div>
                <span
                  className={cn(
                    "hidden h-12 w-12 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 sm:grid",
                    TONES[i % TONES.length],
                  )}
                >
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
