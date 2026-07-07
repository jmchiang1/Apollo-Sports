import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { Shuttlecock } from "./Shuttlecock";
import { PickleballDot } from "./PickleballDot";

type SportCardProps = {
  name: string;
  tagline: string;
  body: string;
  lead: boolean;
  index: string;
};

export function SportCard({ name, tagline, body, lead, index }: SportCardProps) {
  return (
    <Reveal className={cn(lead ? "lg:col-span-3" : "lg:col-span-2")}>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border-2 border-plum/10 bg-cream p-8 shadow-[8px_8px_0_0_rgba(56,40,44,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_12px_0_0_rgba(56,40,44,0.14)] sm:p-10",
        )}
      >
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="font-display text-sm font-extrabold text-plum/25">
              {index}
            </span>
            <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {name}
            </h3>
            <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.14em] text-gold-deep">
              {tagline}
            </p>
          </div>
          <span
            className={cn(
              "grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:-rotate-12",
              lead ? "bg-plum text-gold" : "bg-peach text-plum",
            )}
          >
            {lead ? (
              <Shuttlecock className="h-6 w-6" />
            ) : (
              <PickleballDot className="h-6 w-6" />
            )}
          </span>
        </div>

        <p className="relative mt-6 flex-grow text-[1.02rem] leading-relaxed text-muted">
          {body}
        </p>

        {lead && (
          <span className="relative mt-8 inline-flex w-fit items-center rounded-full bg-gold px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-plum">
            🏸 Lead sport
          </span>
        )}
      </article>
    </Reveal>
  );
}
