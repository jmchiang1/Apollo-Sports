import { whyUs } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { OverlayGraphic } from "./OverlayGraphic";
import { ApolloMascot } from "./ApolloMascot";

export function WhyUsGrid() {
  const [feature, ...rest] = whyUs.items;
  const FeatureIcon = iconMap[feature.icon as IconName];

  return (
    <SectionWrapper id="why-us" className="whyus-section">
      <div
        aria-hidden
        className="whyus-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(228,168,53,0.5) 0%, rgba(228,168,53,0) 65%)",
        }}
      />
      <OverlayGraphic src="/birdie.svg" invert className="whyus-birdie" />

      <div className="whyus-heading-wrap">
        <Reveal as="h2" className="whyus-heading">
          {whyUs.heading}
        </Reveal>
      </div>

      <div className="whyus-grid">
        {/* big feature */}
        <Reveal className="whyus-feature-col">
          <div className="whyus-feature-card">
            <div>
              <span className="whyus-feature-chip">
                {FeatureIcon ? <FeatureIcon className="whyus-feature-icon" strokeWidth={2} /> : null}
              </span>
              <h3 className="whyus-feature-title">{feature.title}</h3>
              <p className="whyus-feature-body">{feature.body}</p>
            </div>
            <div className="whyus-feature-footer">
              <ApolloMascot className="whyus-mascot" />
              <span className="whyus-mascot-note">Apollo-approved.</span>
            </div>
          </div>
        </Reveal>

        {/* stacked list */}
        <Reveal className="whyus-list-col">
          <div className="whyus-list">
            {rest.map((item) => {
              const Icon = iconMap[item.icon as IconName];
              return (
                <div key={item.title} className="group whyus-list-item">
                  <span className="whyus-list-chip">
                    {Icon ? <Icon className="whyus-list-icon" strokeWidth={2} /> : null}
                  </span>
                  <div>
                    <h3 className="whyus-list-title">{item.title}</h3>
                    <p className="whyus-list-body">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
