"use client";

import { useSyncExternalStore } from "react";
import { motion, type Variants } from "motion/react";
import { Check, X } from "lucide-react";
import { pricing } from "@/config/siteConfig";
import { SectionWrapper, Reveal, RevealGroup, useSafeReducedMotion } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { TodoText } from "./Todo";
import { ButtonLink } from "./Button";
import { OverlayGraphic } from "./OverlayGraphic";
import { PawPrint } from "./PawPrint";
import { DogSleeping } from "./DogSleeping";
import { DogWalking } from "./DogWalking";
import { DogPlaying } from "./DogPlaying";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Membership tiers lead with an Apollo illustration instead of an icon. */
const DOG_GRAPHICS = {
  sleeping: DogSleeping,
  walking: DogWalking,
  playing: DogPlaying,
} as const;

const [membership, rates] = pricing.groups;

type Group = (typeof pricing.groups)[number];
type Plan = Group["plans"][number];
type DealRole = "center" | "left" | "right";

// The membership grid "deals" outward: the featured Player reveals first, then
// Free and Premier slide out from behind it to the left and right.
const dealVariants: Record<DealRole, Variants> = {
  center: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  },
  left: {
    hidden: { opacity: 0, x: "92%", scale: 0.85 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.62, ease: EASE, delay: 0.36 },
    },
  },
  right: {
    hidden: { opacity: 0, x: "-92%", scale: 0.85 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.62, ease: EASE, delay: 0.36 },
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

/** One pricing tier card. `dog` swaps the check bullets for Apollo's paw. */
function PricingCard({
  plan,
  featured,
  muted,
  dog,
  role,
}: {
  plan: Plan;
  featured?: boolean;
  muted?: boolean;
  dog?: boolean;
  role?: DealRole;
}) {
  const Icon = "icon" in plan ? iconMap[plan.icon as IconName] : undefined;
  const badge = "badge" in plan ? plan.badge : undefined;
  const graphic = "graphic" in plan ? plan.graphic : undefined;
  const excluded = "excluded" in plan ? plan.excluded : undefined;
  const Dog = graphic ? DOG_GRAPHICS[graphic] : undefined;
  // Player + Premier illustrations read better facing inward — flip them.
  const dogFlip = graphic !== undefined && graphic !== "sleeping";

  const card = (
    <div
      className={cn(
        "pricing-card",
        featured && "pricing-card-featured",
        muted && "pricing-card-muted",
      )}
    >
      {badge && (
        <span className="pricing-badge">
          {/* <PawPrint className="pricing-badge-paw" aria-hidden /> */}
          {badge}
        </span>
      )}

      {/* Apollo illustration as a faint top-right watermark, oversized so it
          bleeds off the card edge. Clipped to the card's rounded rect by its
          own wrapper so the badge (outside it) stays uncut. */}
      {Dog && (
        <div className="pricing-card-dog-clip" aria-hidden>
          <Dog
            className={cn(
              "pricing-card-dog",
              graphic && `pricing-card-dog-${graphic}`,
              dogFlip && "pricing-card-dog-flip",
            )}
          />
        </div>
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
  dog,
  deal,
}: {
  group: Group;
  dog?: boolean;
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
        dog={dog}
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
 * band. Player is the featured "Most popular" tier. On desktop the three cards
 * "deal out" from behind Player; on mobile they use the standard fade-up.
 */
export function MembershipSection() {
  const lg = useSyncExternalStore(resizeSubscribe, readLg, readFalse);
  return (
    <SectionWrapper id="pricing" className="pricing-section membership-section">
      <PricingHead
        eyebrow={membership.eyebrow}
        heading={membership.heading}
        sub={pricing.note}
      />
      <PlanGrid group={membership} dog deal={lg} />
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
      <PlanGrid group={rates} dog />
    </SectionWrapper>
  );
}
