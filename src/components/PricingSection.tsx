"use client";

import { useSyncExternalStore } from "react";
import { motion, type Variants } from "motion/react";
import { Check, X } from "lucide-react";
import { pricing } from "@/config/siteConfig";
import { HeadingCut, SectionWrapper, Reveal, RevealGroup, useSafeReducedMotion } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { TodoText } from "./Todo";
import { ButtonLink } from "./Button";
import { OverlayGraphic } from "./OverlayGraphic";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

const [membership, rates] = pricing.groups;

type Group = (typeof pricing.groups)[number];
type Plan = Group["plans"][number];
type DealRole = "center" | "left" | "right";

// The membership grid "deals" outward: the featured Athlete reveals first, then
// Initiate and Olympian slide out from behind it to the left and right.
const dealVariants: Record<DealRole, Variants> = {
  center: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
  },
  left: {
    hidden: { opacity: 0, x: "92%", scale: 0.85 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: EASE,
        delay: 0.55,
        // Hold the (translucent) card invisible while it's still behind Athlete,
        // then fade to 100% as it clears — no ghosting through Athlete's fill.
        opacity: { duration: 0.5, ease: EASE, delay: 0.85 },
      },
    },
  },
  right: {
    hidden: { opacity: 0, x: "-92%", scale: 0.85 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: EASE,
        delay: 0.55,
        // Hold the (translucent) card invisible while it's still behind Athlete,
        // then fade to 100% as it clears — no ghosting through Athlete's fill.
        opacity: { duration: 0.5, ease: EASE, delay: 0.85 },
      },
    },
  },
};
// Keep the featured card on top so the others read as emerging from behind it.
const dealZ: Record<DealRole, number> = { center: 3, left: 1, right: 1 };
// No stagger — each card sequences itself via its own transition delay.
const dealContainer: Variants = { hidden: {}, visible: {} };

const resizeSubscribe = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const readLg = () => window.innerWidth >= 1024;
const readFalse = () => false;

/** One pricing tier card. */
function PricingCard({
  plan,
  featured,
  muted,
  role,
}: {
  plan: Plan;
  featured?: boolean;
  muted?: boolean;
  role?: DealRole;
}) {
  const Icon = "icon" in plan ? iconMap[plan.icon as IconName] : undefined;
  const badge = "badge" in plan ? plan.badge : undefined;
  const excluded = "excluded" in plan ? plan.excluded : undefined;

  const card = (
    <div
      className={cn(
        "pricing-card",
        featured && "pricing-card-featured",
        muted && "pricing-card-muted",
      )}
    >
      {/* Laurel wreath, top-right of the featured (Athlete) card. Painted as a
          mask so it takes `currentColor` and stays on the gold palette. */}
      {featured && <span aria-hidden className="pricing-wreath" />}

      {badge && (
        <span className="pricing-badge">
          {badge}
        </span>
      )}

      {Icon && (
        <div className="pricing-card-head">
          <span className="pricing-icon">
            <Icon className="pricing-icon-glyph" strokeWidth={2} />
          </span>
        </div>
      )}

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
            <span className="pricing-feature-check">
              <Check className="pricing-feature-icon" strokeWidth={3} />
            </span>
            <span className="pricing-feature-label">{f}</span>
          </li>
        ))}
        {excluded?.map((f) => (
          <li key={f} className="pricing-feature pricing-feature-off">
            <span className="pricing-feature-check pricing-feature-check-x">
              <X className="pricing-feature-icon" strokeWidth={3} />
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
  );

  // Deal-out mode (membership on lg): a grid cell with role-based motion.
  if (role) {
    return (
      <motion.div
        className="pricing-card-cell"
        variants={dealVariants[role]}
        style={{ zIndex: dealZ[role] }}
      >
        {card}
      </motion.div>
    );
  }

  return <Reveal>{card}</Reveal>;
}

function PlanGrid({
  group,
  deal,
}: {
  group: Group;
  deal?: boolean;
}) {
  const reduce = useSafeReducedMotion();
  const hasFeatured = group.plans.some((p) => "featured" in p && p.featured);
  const gridClass = cn(
    "pricing-grid",
    group.plans.length <= 2 && "pricing-grid-2",
    hasFeatured && "pricing-grid-featured",
  );

  const cells = group.plans.map((plan, i) => {
    const isFeatured = "featured" in plan && plan.featured;
    const role: DealRole | undefined = deal
      ? isFeatured
        ? "center"
        : i === 0
          ? "left"
          : "right"
      : undefined;
    return (
      <PricingCard
        key={plan.name}
        plan={plan}
        featured={isFeatured}
        muted={hasFeatured && !isFeatured}
        role={role}
      />
    );
  });

  if (deal) {
    return (
      <motion.div
        className="pricing-group"
        variants={dealContainer}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
      >
        <div className={gridClass}>{cells}</div>
      </motion.div>
    );
  }

  return (
    <RevealGroup className="pricing-group">
      <div className={gridClass}>{cells}</div>
    </RevealGroup>
  );
}

function PricingHead({ heading, sub }: { heading: string; sub: string }) {
  return (
    <div className="pricing-heading-wrap">
      <HeadingCut className="pricing-heading">
        {heading}
      </HeadingCut>
      <Reveal as="p" className="pricing-note">
        {sub}
      </Reveal>
    </div>
  );
}

/**
 * Memberships — the recurring tiers (Initiate / Athlete / Olympian), on the
 * dark onyx band. Athlete is the featured "Most popular" tier. On desktop the
 * three cards "deal out" from behind Athlete; on mobile they fade up.
 */
export function MembershipSection() {
  const lg = useSyncExternalStore(resizeSubscribe, readLg, readFalse);
  return (
    <SectionWrapper id="pricing" className="pricing-section membership-section">
      <PricingHead heading={membership.heading} sub={pricing.note} />
      <PlanGrid group={membership} deal={lg} />
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
      <PricingHead heading={rates.heading} sub={rates.subtitle} />
      <PlanGrid group={rates} />
    </SectionWrapper>
  );
}
