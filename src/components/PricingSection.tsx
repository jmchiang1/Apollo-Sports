import { Check } from "lucide-react";
import { pricing } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { TodoText } from "./Todo";
import { ButtonLink } from "./Button";
import { OverlayGraphic } from "./OverlayGraphic";

/**
 * Membership & rates — the dark plum band that replaces the old "Why Us" grid.
 * These are three *different* ways to play (membership, private court booking,
 * open play), not tiers of one plan — so every card is weighted equally and
 * none is flagged "most popular". Prices are rendered as [TODO] tokens until
 * Jonathan confirms real figures.
 */
export function PricingSection() {
  return (
    <SectionWrapper id="pricing" className="pricing-section">
      <OverlayGraphic src="/pickleball.svg" invert className="pricing-pickleball" />

      <div className="pricing-heading-wrap">
        <Reveal as="h2" className="pricing-heading">
          {pricing.heading}
        </Reveal>
        <Reveal as="p" className="pricing-note">
          {pricing.note}
        </Reveal>
      </div>

      <div className="pricing-grid">
        {pricing.plans.map((plan) => {
          const Icon = iconMap[plan.icon as IconName];
          return (
            <Reveal key={plan.name}>
              <div className="pricing-card">
                <div className="pricing-card-head">
                  <span className="pricing-icon">
                    {Icon ? <Icon className="pricing-icon-glyph" strokeWidth={2} /> : null}
                  </span>
                </div>

                <h3 className="pricing-plan-name">{plan.name}</h3>
                <p className="pricing-plan-tagline">{plan.tagline}</p>

                <div className="pricing-price-row">
                  <TodoText className="pricing-price">{plan.price}</TodoText>
                  <span className="pricing-unit">{plan.unit}</span>
                </div>

                <ul className="pricing-features">
                  {plan.features.map((f) => (
                    <li key={f} className="pricing-feature">
                      <span className="pricing-feature-check">
                        <Check className="pricing-feature-icon" strokeWidth={3} />
                      </span>
                      <span className="pricing-feature-label">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="pricing-cta-wrap">
                  <ButtonLink
                    href={plan.cta.href}
                    variant="cream"
                    size="md"
                    className="pricing-cta"
                  >
                    {plan.cta.label}
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
