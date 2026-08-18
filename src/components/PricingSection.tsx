import { Check } from "lucide-react";
import { pricing } from "@/config/siteConfig";
import { SectionWrapper, Reveal, RevealGroup } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { TodoText } from "./Todo";
import { ButtonLink } from "./Button";
import { OverlayGraphic } from "./OverlayGraphic";
import { PawPrint } from "./PawPrint";
import { DogPeeking } from "./DogPeeking";
import { cn } from "@/lib/cn";

const [membership, rates] = pricing.groups;

type Group = (typeof pricing.groups)[number];
type Plan = Group["plans"][number];

/** One pricing tier card. `dog` swaps the check bullets for Apollo's paw. */
function PricingCard({
  plan,
  featured,
  muted,
  dog,
}: {
  plan: Plan;
  featured?: boolean;
  muted?: boolean;
  dog?: boolean;
}) {
  const Icon = iconMap[plan.icon as IconName];
  const badge = "badge" in plan ? plan.badge : undefined;
  return (
    <Reveal>
      <div
        className={cn(
          "pricing-card",
          featured && "pricing-card-featured",
          muted && "pricing-card-muted",
        )}
      >
        {/* faint paw watermark on the headline tier */}
        {featured && <PawPrint className="pricing-card-paw" aria-hidden />}

        {badge && (
          <span className="pricing-badge">
            <PawPrint className="pricing-badge-paw" aria-hidden />
            {badge}
          </span>
        )}

        <div className="pricing-card-head">
          <span className="pricing-icon">
            {Icon ? <Icon className="pricing-icon-glyph" strokeWidth={2} /> : null}
          </span>
        </div>

        <h3 className="pricing-plan-name">{plan.name}</h3>
        <p className="pricing-plan-tagline">{plan.tagline}</p>

        <div className="pricing-price-row">
          {"pricePrefix" in plan && (
            <span className="pricing-price-prefix">{plan.pricePrefix}</span>
          )}
          <TodoText className="pricing-price">{plan.price}</TodoText>
          <span className="pricing-unit">{plan.unit}</span>
        </div>

        <ul className="pricing-features">
          {plan.features.map((f) => (
            <li key={f} className="pricing-feature">
              <span
                className={cn(
                  "pricing-feature-check",
                  dog && "pricing-feature-check-paw",
                )}
              >
                {dog ? (
                  <PawPrint className="pricing-feature-icon" aria-hidden />
                ) : (
                  <Check className="pricing-feature-icon" strokeWidth={3} />
                )}
              </span>
              <span className="pricing-feature-label">{f}</span>
            </li>
          ))}
        </ul>

        <div className="pricing-cta-wrap">
          <ButtonLink
            href={plan.cta.href}
            variant={featured ? "accent" : "cream"}
            size="md"
            className="pricing-cta"
          >
            {plan.cta.label}
          </ButtonLink>
        </div>
      </div>
    </Reveal>
  );
}

function PlanGrid({ group, dog }: { group: Group; dog?: boolean }) {
  const hasFeatured = group.plans.some((p) => "featured" in p && p.featured);
  return (
    <RevealGroup className="pricing-group">
      <div
        className={cn(
          "pricing-grid",
          group.plans.length <= 2 && "pricing-grid-2",
          hasFeatured && "pricing-grid-featured",
        )}
      >
        {group.plans.map((plan) => {
          const isFeatured = "featured" in plan && plan.featured;
          return (
            <PricingCard
              key={plan.name}
              plan={plan}
              featured={isFeatured}
              muted={hasFeatured && !isFeatured}
              dog={dog}
            />
          );
        })}
      </div>
    </RevealGroup>
  );
}

function PricingHead({
  eyebrow,
  heading,
  sub,
}: {
  eyebrow: string;
  heading: string;
  sub: string;
}) {
  return (
    <div className="pricing-heading-wrap">
      <Reveal as="p" className="pricing-eyebrow">
        {eyebrow}
      </Reveal>
      <Reveal as="h2" className="pricing-heading">
        {heading}
      </Reveal>
      <Reveal as="p" className="pricing-note">
        {sub}
      </Reveal>
    </div>
  );
}

/**
 * Memberships — the recurring tiers (Free / Player / Premier), on the dark plum
 * band. Player is the featured "Most popular" tier. Apollo touches throughout:
 * paw-print bullets, a paw watermark on the featured card, and a peeking dog.
 */
export function MembershipSection() {
  return (
    <SectionWrapper id="pricing" className="pricing-section membership-section">
      <div className="membership-peek-wrap" aria-hidden>
        <DogPeeking className="membership-peek" />
      </div>
      <PricingHead
        eyebrow={membership.eyebrow}
        heading={membership.heading}
        sub={pricing.note}
      />
      <PlanGrid group={membership} dog />
    </SectionWrapper>
  );
}

/**
 * Pay as you go — the one-time options (court booking, open play, clinics &
 * events). A separate section on a lighter plum so it reads distinctly from
 * memberships.
 */
export function RatesSection() {
  return (
    <SectionWrapper id="rates" className="pricing-section rates-section">
      <OverlayGraphic src="/birdie.svg" invert className="pricing-birdie" />
      <PricingHead
        eyebrow={rates.eyebrow}
        heading={rates.heading}
        sub={rates.subtitle}
      />
      <PlanGrid group={rates} />
    </SectionWrapper>
  );
}
