import { programs } from "@/config/siteConfig";
import { HeadingCut, SectionWrapper, RevealOnScroll } from "./Reveal";
import { iconMap, type IconName } from "./icons";

export function ProgramsSection() {
  return (
    <SectionWrapper id="programs" className="programs-section">

      <div className="programs-heading-wrap">
        <HeadingCut className="programs-heading">
          {programs.heading}
        </HeadingCut>
      </div>

      <div className="programs-list">
        {programs.cards.map((card, i) => {
          const Icon = iconMap[card.icon as IconName];
          return (
            <RevealOnScroll key={card.name}>
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
            </RevealOnScroll>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
