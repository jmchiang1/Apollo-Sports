import { Check } from "lucide-react";
import { sports } from "@/config/siteConfig";
import { cn } from "@/lib/cn";
import { SectionWrapper, Reveal } from "./Reveal";
import { TodoText } from "./Todo";
import { Shuttlecock } from "./Shuttlecock";
import { PickleballDot } from "./PickleballDot";

function SportRow({
  name,
  tagline,
  body,
  features,
  lead,
  index,
}: {
  name: string;
  tagline: string;
  body: string;
  features: readonly string[];
  lead: boolean;
  index: string;
}) {
  const flip = !lead; // second row mirrors

  return (
    <Reveal>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* graphic panel */}
        <div className={cn(flip && "lg:order-2")}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-2 border-plum/10 bg-cream shadow-[10px_10px_0_0_rgba(56,40,44,0.12)]">
            <div className="tex-waffle absolute inset-0 text-plum/[0.05]" />
            <Shuttlecock className="absolute left-6 top-6 h-8 w-8 rotate-[-16deg] text-cream-2" />
            <PickleballDot className="absolute right-8 top-10 h-6 w-6 text-cream-2" />
            <div className="absolute inset-0 grid place-items-center">
              <span
                className={cn(
                  "grid h-28 w-28 place-items-center rounded-full shadow-lg transition-transform duration-500",
                  lead ? "bg-plum text-gold" : "bg-peach text-plum",
                )}
              >
                {lead ? (
                  <Shuttlecock className="h-16 w-16" />
                ) : (
                  <PickleballDot className="h-16 w-16" />
                )}
              </span>
            </div>
            <span className="absolute bottom-3 right-5 font-display text-7xl font-extrabold leading-none text-plum/10">
              {index}
            </span>
          </div>
        </div>

        {/* text */}
        <div className={cn(flip && "lg:order-1")}>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gold-deep">
            {tagline}
          </p>
          <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {name}
          </h3>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink/75">{body}</p>
          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-plum">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span className="font-semibold text-ink">{f}</span>
              </li>
            ))}
          </ul>
          {lead && (
            <span className="mt-6 inline-flex w-fit items-center rounded-full bg-plum px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-cream">
              🏸 Lead sport
            </span>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function SportsSection() {
  return (
    <SectionWrapper id="sports" className="relative overflow-hidden bg-peach">
      <div
        aria-hidden
        className="tex-waffle pointer-events-none absolute inset-0 text-plum/[0.04]"
      />

      <div className="relative">
        <div className="max-w-2xl">
          <Reveal as="p" className="eyebrow text-plum/60">
            {sports.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[3rem]"
          >
            {sports.heading}
          </Reveal>
        </div>

        <div className="mt-14 space-y-14 sm:mt-16 sm:space-y-20">
          {sports.cards.map((card, i) => (
            <SportRow
              key={card.name}
              name={card.name}
              tagline={card.tagline}
              body={card.body}
              features={card.features}
              lead={card.lead}
              index={String(i + 1).padStart(2, "0")}
            />
          ))}
        </div>

        <Reveal as="p" className="mt-12 text-sm font-medium text-plum/70">
          Courts — <TodoText>{sports.courtsNote}</TodoText>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
