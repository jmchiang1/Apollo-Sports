import { Shuttlecock } from "./Shuttlecock";

const ITEMS = [
  "Badminton",
  "Pickleball",
  "Open Play",
  "Leagues",
  "Coaching",
  "Youth",
  "Memberships",
  "Community",
];

/** Retro scrolling ticker under the hero. Pauses for reduced-motion users. */
export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {ITEMS.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-6 font-display text-lg font-extrabold uppercase tracking-tight text-cream">
            {t}
          </span>
          <Shuttlecock className="h-5 w-5 text-gold" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y-2 border-plum-deep bg-plum py-4">
      <div className="flex w-max animate-[marquee_30s_linear_infinite] motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  );
}
