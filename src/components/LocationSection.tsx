import { MapPin } from "lucide-react";
import { location } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { TodoText } from "./Todo";
import { PawPrint } from "./PawPrint";

// Alternate the area-pill colors for a playful row.
const PILL_TONES = [
  "bg-peach-soft",
  "bg-rose-soft",
  "bg-gold-soft",
];

export function LocationSection() {
  return (
    <SectionWrapper id="location" className="bg-cream">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* copy */}
        <div>
          <Reveal as="p" className="eyebrow">
            {location.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]"
          >
            {location.heading}
          </Reveal>
          <Reveal as="p" className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            {location.body}
          </Reveal>

          <Reveal>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {location.areas.map((area, i) => (
                <li
                  key={area}
                  className={`rounded-full border-2 border-plum/10 px-4 py-1.5 text-sm font-semibold text-ink ${PILL_TONES[i % PILL_TONES.length]}`}
                >
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <p className="mt-6 flex items-center gap-2 text-sm font-medium text-muted">
              <MapPin className="h-4 w-4 shrink-0 text-gold-deep" />
              <TodoText>{location.addressLabel}</TodoText>
            </p>
          </Reveal>
        </div>

        {/* playful map placeholder */}
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-2 border-plum/10 bg-cream-2 shadow-[8px_8px_0_0_rgba(56,40,44,0.1)]">
            {/* street grid */}
            <div
              aria-hidden
              className="tex-waffle absolute inset-0 text-plum/[0.1]"
              style={{ backgroundSize: "40px 40px" }}
            />
            {/* diagonal parkway */}
            <div
              aria-hidden
              className="absolute -inset-8 rotate-[24deg]"
              style={{
                background:
                  "repeating-linear-gradient(90deg, transparent 0 120px, rgba(228,168,53,0.16) 120px 130px)",
              }}
            />
            {/* a 'park' block */}
            <div
              aria-hidden
              className="absolute left-6 top-6 h-20 w-28 rounded-xl bg-peach/40"
            />
            <PawPrint
              aria-hidden
              className="absolute bottom-6 right-8 h-9 w-9 rotate-12 text-rose"
            />

            {/* center pin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="relative flex items-center justify-center">
                <span className="absolute h-16 w-16 animate-ping rounded-full bg-gold/25" />
                <span className="grid h-12 w-12 place-items-center rounded-full bg-plum text-gold shadow-lg">
                  <MapPin className="h-5 w-5" />
                </span>
              </span>
            </div>

            {/* label */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-plum/10 bg-cream px-4 py-2.5">
              <span className="font-display text-sm font-extrabold text-ink">
                Central Nassau County
              </span>
              <span className="text-xs">
                <TodoText>{location.addressLabel}</TodoText>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
