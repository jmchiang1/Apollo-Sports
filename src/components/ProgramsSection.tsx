import { programs } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { ProgramsDog } from "./ProgramsDog";

export function ProgramsSection() {
  return (
    <SectionWrapper id="programs" className="programs-section">
      <ProgramsDog />

      <div className="programs-heading-wrap">
        <Reveal as="h2" className="programs-heading">
          {programs.heading}
        </Reveal>
      </div>

      <div className="programs-list">
        {programs.cards.map((card, i) => {
          const Icon = iconMap[card.icon as IconName];
          return (
            <Reveal key={card.name}>
              <div className="programs-row">
                <span className="programs-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="programs-row-body">
                  <h3 className="programs-title">{card.name}</h3>
                  <p className="programs-body">{card.body}</p>
                </div>
                <span className="programs-icon-chip">
                  {Icon ? <Icon className="programs-icon" strokeWidth={2} /> : null}
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
