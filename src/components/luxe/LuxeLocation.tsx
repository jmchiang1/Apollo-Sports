import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import { location, todo } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "@/components/Reveal";
import { TodoText } from "@/components/Todo";

export function LuxeLocation() {
  const info: { label: string; value: ReactNode }[] = [
    { label: "Address", value: <TodoText>{location.addressLabel}</TodoText> },
    { label: "Hours", value: <TodoText>{todo.hours}</TodoText> },
    { label: "Access", value: "Easy parking · minutes from the LIRR & parkways" },
  ];

  return (
    <SectionWrapper id="location" className="bg-butter text-olive-ink">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        {/* copy + details */}
        <div>
          <Reveal as="p" className="luxe-eyebrow text-brass">
            {location.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            className="mt-6 font-serif text-4xl font-medium tracking-tight sm:text-5xl"
          >
            {location.heading}
          </Reveal>
          <Reveal
            as="p"
            className="mt-6 max-w-lg font-luxe text-lg font-light leading-relaxed text-olive-ink/75"
          >
            {location.body}
          </Reveal>

          <Reveal>
            <dl className="mt-10 border-t border-olive-ink/15">
              {info.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 border-b border-olive-ink/15 py-4 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <dt className="luxe-eyebrow w-28 shrink-0 text-olive-muted">
                    {row.label}
                  </dt>
                  <dd className="font-serif text-lg text-olive-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* elegant map */}
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden border border-olive-ink/15 bg-ivory">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(33,42,26,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(33,42,26,0.06) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <div
              aria-hidden
              className="absolute -inset-10 rotate-[22deg]"
              style={{
                background:
                  "repeating-linear-gradient(90deg, transparent 0 140px, rgba(166,124,60,0.12) 140px 148px)",
              }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-brass/40 bg-butter text-brass">
                <MapPin className="h-5 w-5" />
              </span>
              <p className="mt-3 luxe-eyebrow text-olive-muted">Central Nassau</p>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
