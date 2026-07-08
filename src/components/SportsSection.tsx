import { Check } from "lucide-react";
import { sports } from "@/config/siteConfig";
import { cn } from "@/lib/cn";
import { SectionWrapper, Reveal } from "./Reveal";
import { OverlayGraphic } from "./OverlayGraphic";
import { IsoCourt } from "./IsoCourt";

type Sport = "badminton" | "pickleball";

/**
 * A cluster of small isometric courts standing in for a stock photo — one court
 * per real court the club will have (4 badminton / 2 pickleball), reusing the
 * hero's IsoCourt illustration so the section stays fully on-brand.
 */
function CourtCluster({ sport, count }: { sport: Sport; count: number }) {
  return (
    <div className="sports-cluster">
      <div
        className={cn(
          "sports-cluster-grid",
          count > 2 ? "sports-cluster-grid-multi" : "sports-cluster-grid-single",
        )}
      >
        {Array.from({ length: count }).map((_, i) => (
          <IsoCourt key={i} sport={sport} className="sports-cluster-court" />
        ))}
      </div>
    </div>
  );
}

function SportRow({
  title,
  body,
  features,
  lead,
  sport,
  courts,
}: {
  title: string;
  body: string;
  features: readonly string[];
  lead: boolean;
  sport: Sport;
  courts: number;
}) {
  const flip = !lead; // second row mirrors

  return (
    <Reveal>
      <div className="sports-row">
        {/* court cluster */}
        <div className={cn(flip && "sports-row-media-flip")}>
          <CourtCluster sport={sport} count={courts} />
        </div>

        {/* text */}
        <div className={cn(flip && "sports-row-text-flip")}>
          <h3 className="sports-row-title">{title}</h3>
          <p className="sports-row-body">{body}</p>
          <ul className="sports-features">
            {features.map((f) => (
              <li key={f} className="sports-feature">
                <span className="sports-feature-check">
                  <Check className="sports-feature-icon" strokeWidth={3} />
                </span>
                <span className="sports-feature-label">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

export function SportsSection() {
  return (
    <SectionWrapper id="sports" className="sports-section">
      {/* big pickleball watermark bleeding off the top-right corner */}
      <OverlayGraphic src="/pickleball.svg" className="sports-pickleball" />

      <div className="sports-inner">
        <div className="sports-heading-wrap">
          <Reveal as="h2" className="sports-heading">
            {sports.heading}
          </Reveal>
        </div>

        <div className="sports-rows">
          {sports.cards.map((card) => (
            <SportRow
              key={card.name}
              title={`${card.courts} ${card.name} courts`}
              body={card.body}
              features={card.features}
              lead={card.lead}
              sport={card.name.toLowerCase() as Sport}
              courts={card.courts}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
