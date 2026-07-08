import { Check } from "lucide-react";
import { pricing } from "@/config/siteConfig";
import { cn } from "@/lib/cn";
import { SectionWrapper, Reveal } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { TodoText } from "./Todo";
import { ButtonLink } from "./Button";
import { OverlayGraphic } from "./OverlayGraphic";

/**
 * Membership & rates — the dark plum band that replaces the old "Why Us" grid.
 * Three ways to play (membership, private court booking, open play); prices are
 * intentionally rendered as [TODO] tokens until Jonathan confirms real figures.
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
              <div
                className={cn(
                  "pricing-card",
                  plan.featured ? "pricing-card-featured" : "pricing-card-plain",
                )}
              >
                <div className="pricing-card-head">
                  <span
                    className={cn(
                      "pricing-icon",
                      plan.featured ? "pricing-icon-featured" : "pricing-icon-plain",
                    )}
                  >
                    {Icon ? <Icon className="pricing-icon-glyph" strokeWidth={2} /> : null}
                  </span>
                  {plan.badge ? (
                    <span className="pricing-badge">{plan.badge}</span>
                  ) : null}
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
                      <span
                        className={cn(
                          "pricing-feature-check",
                          plan.featured
                            ? "pricing-feature-check-featured"
                            : "pricing-feature-check-plain",
                        )}
                      >
                        <Check className="pricing-feature-icon" strokeWidth={3} />
                      </span>
                      <span className="pricing-feature-label">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="pricing-cta-wrap">
                  <ButtonLink
                    href={plan.cta.href}
                    variant={plan.featured ? "accent" : "cream"}
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
