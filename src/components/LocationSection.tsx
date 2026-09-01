import type { ReactNode } from "react";
import { MapPin, Clock, Car, type LucideIcon } from "lucide-react";
import { location, todo } from "@/config/siteConfig";
import { HeadingCut, SectionWrapper, Reveal } from "./Reveal";
import { TodoText } from "./Todo";
import { HoursDialog } from "./HoursDialog";

/** `extra` is an optional node under `sub` (Hours uses it for its dialog). */
type InfoCard = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  sub: string;
  extra?: ReactNode;
};

const cards: InfoCard[] = [
  {
    icon: MapPin,
    label: "Address",
    value: location.address,
    sub: "Exact address to be confirmed",
  },
  {
    icon: Clock,
    label: "Hours",
    value: <TodoText>{todo.hours}</TodoText>,
    sub: "16 hours a day · 7 days",
    // Which hours are peak decides which court rate applies, so it belongs on
    // this card — but spelled out it's too long to sit in it, hence the dialog.
    extra: <HoursDialog />,
  },
  {
    icon: Car,
    label: "Getting here",
    value: "Easy parking",
    sub: "Minutes from the LIRR & parkways",
  },
];

export function LocationSection() {
  return (
    <SectionWrapper id="location" className="location-section">
      <div className="location-grid">
        {/* copy */}
        <div>
          <HeadingCut className="location-heading">
            {location.heading}
          </HeadingCut>
          <Reveal as="p" className="location-body">
            {location.body}
          </Reveal>
          <Reveal>
            <ul className="location-pills">
              {location.areas.map((area) => (
                <li key={area} className="location-pill">
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Map — placeholder site (see location.address) until a lease is signed. */}
        <Reveal>
          <div className="location-map">
            <iframe
              className="location-map-frame"
              title={`Map of ${location.address}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(location.address)}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>

      {/* info cards */}
      <div className="location-cards">
        {cards.map(({ icon: Icon, label, value, sub, extra }) => (
          <Reveal key={label}>
            <div className="location-card">
              <span className="location-card-chip">
                <Icon className="location-card-icon" strokeWidth={2} />
              </span>
              <div>
                <p className="location-card-label">{label}</p>
                <p className="location-card-value">{value}</p>
                <p className="location-card-sub">{sub}</p>
                {extra}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
