import { MapPin, Clock, Car } from "lucide-react";
import { location, todo } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { TodoText } from "./Todo";
import { PawPrint } from "./PawPrint";

const PILL_TONES = ["bg-peach-soft", "bg-rose-soft", "bg-gold-soft"];

export function LocationSection() {
  return (
    <SectionWrapper id="location" className="bg-cream">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* copy */}
        <div>
          <Reveal
            as="h2"
            className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[3rem]"
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
        </div>

        {/* playful map */}
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-2 border-plum/10 bg-cream-2 shadow-[10px_10px_0_0_rgba(56,40,44,0.1)]">
            <div
              aria-hidden
              className="tex-waffle absolute inset-0 text-plum/[0.1]"
              style={{ backgroundSize: "40px 40px" }}
            />
            <div
              aria-hidden
              className="absolute -inset-8 rotate-[24deg]"
              style={{
                background:
                  "repeating-linear-gradient(90deg, transparent 0 120px, rgba(228,168,53,0.16) 120px 130px)",
              }}
            />
            <div
              aria-hidden
              className="absolute left-6 top-6 h-20 w-28 rounded-xl bg-peach/40"
            />
            <PawPrint
              aria-hidden
              className="absolute bottom-6 right-8 h-9 w-9 rotate-12 text-rose"
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="relative flex items-center justify-center">
                <span className="absolute h-16 w-16 animate-ping rounded-full bg-gold/25" />
                <span className="grid h-12 w-12 place-items-center rounded-full bg-plum text-gold shadow-lg">
                  <MapPin className="h-5 w-5" />
                </span>
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border-2 border-plum/10 bg-cream px-4 py-2.5">
              <span className="font-display text-sm font-extrabold text-ink">
                Central Nassau County
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* info cards */}
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {[
          {
            icon: MapPin,
            label: "Address",
            value: <TodoText>{location.addressLabel}</TodoText>,
            sub: "Central Nassau · near Great Neck",
          },
          {
            icon: Clock,
            label: "Hours",
            value: <TodoText>{todo.hours}</TodoText>,
            sub: "Open 7 days once we launch",
          },
          {
            icon: Car,
            label: "Getting here",
            value: "Easy parking",
            sub: "Minutes from the LIRR & parkways",
          },
        ].map(({ icon: Icon, label, value, sub }) => (
          <Reveal key={label}>
            <div className="flex h-full items-start gap-4 rounded-3xl border-2 border-plum/10 bg-cream-2 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold text-plum">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gold-deep">
                  {label}
                </p>
                <p className="mt-1 font-display text-base font-bold text-ink">{value}</p>
                <p className="mt-0.5 text-sm text-muted">{sub}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
