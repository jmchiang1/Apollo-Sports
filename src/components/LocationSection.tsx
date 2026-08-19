import { MapPin, Clock, Car } from "lucide-react";
import { location, todo } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { TodoText } from "./Todo";

export function LocationSection() {
  return (
    <SectionWrapper id="location" className="location-section">
      <div className="location-grid">
        {/* copy */}
        <div>
          <Reveal as="h2" className="location-heading">
            {location.heading}
          </Reveal>
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
        {[
          {
            icon: MapPin,
            label: "Address",
            value: location.address,
            sub: "New Hyde Park, NY · placeholder site",
          },
          {
            icon: Clock,
            label: "Hours",
            value: <TodoText>{todo.hours}</TodoText>,
            sub: "16 hours a day · 7 days",
          },
          {
            icon: Car,
            label: "Getting here",
            value: "Easy parking",
            sub: "Minutes from the LIRR & parkways",
          },
        ].map(({ icon: Icon, label, value, sub }) => (
          <Reveal key={label}>
            <div className="location-card">
              <span className="location-card-chip">
                <Icon className="location-card-icon" strokeWidth={2} />
              </span>
              <div>
                <p className="location-card-label">{label}</p>
                <p className="location-card-value">{value}</p>
                <p className="location-card-sub">{sub}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
