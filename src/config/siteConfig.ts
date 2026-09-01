/**
 * siteConfig.ts — single source of truth for all brand copy and placeholders.
 *
 * ── How placeholders work ──────────────────────────────────────────────
 * Any value only Jonathan can confirm is written as a literal "[TODO: …]"
 * string. The <Todo> renderer (see components/Todo.tsx) styles these tokens
 * so they're impossible to miss in the built site. Never invent a real value
 * for a [TODO] — leave the token until it's confirmed.
 *
 * ── The brand-name swap ────────────────────────────────────────────────
 * `brand.name` is the ONE place to change the consumer brand — currently
 * "Apollo Racket Club" (spelling standardized to "Racket": domain, logo, plan).
 * Change it here and it updates everywhere.
 */

export const brand = {
  // Standardized on "Racket" (matches domain apolloracketclub.com, logo, plan).
  name: "Apollo Racket Club",
  shortName: "Apollo",
  legalEntity: "Apollo Sports LLC",
  tagline: "Nassau County's dedicated badminton club",
  // Named after Apollo, a Nassau local's English Cream Golden Retriever. The
  // namesake stands; the public voice does not lean on it. Copy is classical
  // and restrained (see the membership ladder below), matching the onyx + gold
  // palette that replaced the original cream one.
} as const;

/** Placeholders only Jonathan confirms. Rendered as visible [TODO] tokens. */
export const todo = {
  address: "Coming Soon",
  courts: "8 regulation badminton courts",
  pricing: "[TODO: pricing]",
  hours: "8 AM – Midnight",
  /**
   * Peak / non-peak windows (confirmed Aug 2026). These decide which court
   * rate applies — peak $70 vs non-peak $50, see `pricing`.
   *
   * Non-peak is spelled out rather than written as "all other hours", so it
   * has to be kept in sync: it is the remainder of the 8 AM – Midnight day
   * (`hours` above) once the peak windows are taken out. Change one, redo the
   * other.
   */
  hourBands: [
    { label: "Peak", hours: "Weekdays 5–10 PM · Weekends 8 AM–10 PM" },
    {
      label: "Non-peak",
      hours: "Weekdays 8 AM–5 PM & 10 PM–Midnight · Weekends 10 PM–Midnight",
    },
  ],
  phone: "1 (917) 828 - 0104",
  email: "apolloracketclub@gmail.com",
  opening: "Fall 2027", // brief-sanctioned soft default; confirm exact season
  social: {
    instagram: "https://www.instagram.com/apolloracketclub/",
    facebook: "https://www.facebook.com/profile.php?id=61592577303122",
  },
} as const;

/**
 * Anchor navigation — id must match each section's element id.
 * Vision is deliberately absent: `.vision-section` is display:none, and a
 * hidden target has no box, so the browser can't scroll to it.
 */
export const nav = [
  { label: "Courts", href: "#courts" },
  { label: "Programs", href: "#programs" },
  { label: "Pricing", href: "#pricing" },
  // Location is out until there is an address to publish — restore this entry
  // when LocationSection is mounted again.
  { label: "FAQ", href: "#faq" },
] as const;

export const hero = {
  eyebrow: `Coming in ${todo.opening}`,
  // One line per entry — the hero breaks exactly here, no reflow. Line 1 is the
  // service area; swap it for whichever city/region the club lands in.
  // "Club", not "Center" — the brand is Apollo Racket Club. `Badminton` stays
  // as the SPORT: it is the differentiator the whole site argues for (see the
  // pickleball FAQ), so it is not the brand name and does not become "Racket".
  headlineLines: ["Nassau County's", "Premier Badminton", "Club"],
  // Word within a headline line to accent in gold (must appear verbatim).
  headlineHighlight: "Badminton",
  subhead:
    "A dedicated indoor badminton club in central Nassau County: 8 courts, private bookings, open play, and leagues for every level.",
  primaryCta: { label: "Join the Waitlist", href: "#waitlist" },
  // Points at Programs, not Vision — the Vision section is hidden (see `nav`).
  secondaryCta: { label: "See what we're building", href: "#top" },
} as const;

export const vision = {
  eyebrow: "The Vision",
  heading: "The club we always wished existed.",
  paragraphs: [
    "We're building a welcoming, well-run indoor club where badminton comes first: proper courts, proper height, and a real community for players at every level.",
    "Long Island has plenty of places to play pickleball. What it's missing is a club built for badminton. That's what we're building: eight courts and real programming, all of it badminton.",
    "There's even a real lounge with seating, workspace, and Wi-Fi, for the parent putting in 6–8 hours a week while a kid trains. No badminton facility around here offers it.",
  ],
  founderNote:
    "Built by a lifelong player and Nassau local. We understand the club because we're the ones who've been looking for it.",
} as const;

export const sports = {
  eyebrow: "The Courts",
  heading: "One sport. Done right.",
  courtsNote: todo.courts,
  cards: [
    {
      name: "Badminton",
      courts: 8,
      lead: true,
      body: "Eight regulation courts with true ceiling height and tournament-grade mats and lighting. Singles, doubles, and mixed, from your first rally to competitive league.",
      features: [
        "8 regulation courts & true ceiling height",
        "Tournament-grade mats & lighting",
        "Singles, doubles & mixed play",
        "Spacing, lighting, air & flooring tuned to one sport",
      ],
    },
  ],
} as const;

/** Big-number stat strip. `courts` value is a planning estimate (see todo). */
export const stats = {
  items: [
    { value: "8", label: "Total courts" },
    { value: "22+ ft", label: "Ceiling height" },
    { value: "16", label: "hours a day" },
    { value: "'27", label: "Opening" },
  ],
} as const;

export const programs = {
  eyebrow: "Programs",
  heading: "A reason to come back every week.",
  cards: [
    {
      name: "Open Play",
      body: "Show up, get matched, play. Rated sessions by skill level so every game is a good one.",
      icon: "Users",
    },
    {
      name: "Memberships",
      body: "The best way to play. Priority booking, member rates, and community perks.",
      note: "From $59/mo",
      icon: "BadgeCheck",
    },
    {
      name: "Leagues & Tournaments",
      body: "Rotating up/down leagues, box leagues, and a club ladder. Play with purpose and climb.",
      icon: "Trophy",
    },
    {
      name: "Club Rating System",
      body: "Every session sorted into credible skill bands from ladder and league results, so every game is matched. No other badminton club in the market offers it.",
      icon: "Target",
    },
    {
      name: "Youth Programming",
      body: "After-school, weekend, and holiday programs to build the next generation of players.",
      icon: "Sparkles",
    },
    {
      name: "Coaching & Clinics",
      body: "Private lessons and group clinics, coming soon once our coaching staff are in place.",
      note: "Coming soon",
      icon: "GraduationCap",
    },
  ],
} as const;

/**
 * Membership & rates — from Business Plan V10 / Cash Flow FINAL (Aug 2026).
 * A free registered account (with waiver) is required to play and books at list
 * rate; the two paid tiers below unlock member pricing. Figures are the plan's
 * founding-rate targets; the on-page `note` flags that pricing is still being
 * finalized ahead of opening.
 */
export const pricing = {
  eyebrow: "Membership & Rates",
  heading: "Ways to play and what they'll cost.",
  note: "A free registered account (with signed waiver) is required to play and books at list rate. Member tiers unlock discounts on everything below. Waitlist members lock in founding rates ahead of our 2027 opening.",
  groups: [
    {
      heading: "Take your place.",
      title: "Memberships",
      subtitle: "Start free to play, then upgrade to a paid tier for member pricing.",
      plans: [
        {
          name: "Initiate",
          tagline: "Required to play.",
          price: "$0",
          unit: "to join",
          cta: { label: "Join Now", href: "#waitlist" },
          features: [
            "7-day advance booking, non-priority",
            "Account + signed waiver",
            "No card, no commitment",
            "Upgrade to a paid tier anytime",
          ],
          // Perks this tier is missing — struck through to nudge upgrades. These
          // MIRROR the paid tiers' benefit names on purpose: if those change,
          // change these, or the comparison is against things that do not exist.
          excluded: [
            "Court-rental discounts",
            "Open-play discounts",
            "Guest open-play passes",
            "Extended booking window",
            "Pro-shop discount",
          ],
        },
        {
          name: "Player",
          // The tagline is the headline discount rather than a mood line — it is
          // the thing the tier is actually bought for.
          tagline: "15% off court bookings",
          price: "$59",
          unit: "per month",
          featured: true,
          badge: "Most popular",
          cta: { label: "Join Now", href: "#waitlist" },
          features: [
            "15% off all private court rentals",
            "50% off drop-in open play",
            "1 guest open-play pass per month",
            "14-day advance booking",
            "Pro-shop discount (~10%)",
            "Member pricing on classes, clinics, and events",
            "Priority league/event registration",
          ],
        },
        {
          name: "Premier",
          tagline: "30% off court bookings",
          price: "$129",
          unit: "per month",
          cta: { label: "Join Now", href: "#waitlist" },
          features: [
            "30% off all private court rentals",
            "Free off-peak open play",
            "50% off peak open play",
            "2 guest open-play passes per month",
            "21-day advance booking",
            "Pro-shop discount (~15%)",
            "Member pricing on clinics + 1 free member social event per month",
          ],
        },
      ],
    },
    {
      heading: "Pay as you go.",
      title: "Pay as you go",
      subtitle: "One-time — no membership required. Members save on all of it.",
      plans: [
        {
          name: "Court Booking",
          tagline: "Reserve the whole court.",
          pricePrefix: "From",
          price: "$50",
          unit: "per hour",
          icon: "CalendarClock",
          cta: { label: "Get booking updates", href: "#waitlist" },
          features: [
            "8 regulation badminton courts",
            "Non-peak $50 · peak $70",
            "Book by the hour, online",
            "Unlimited guests on court",
          ],
        },
        {
          name: "Open Play",
          tagline: "Show up and get matched.",
          price: "$25",
          unit: "per drop-in",
          icon: "Users",
          cta: { label: "Get booking updates", href: "#waitlist" },
          features: [
            "All levels, rated by skill",
            "No partner needed",
            "Member & drop-in pricing",
          ],
        },
        {
          name: "Clinics & Events",
          tagline: "Drop in on the calendar.",
          price: "Varies",
          unit: "by event",
          icon: "Sparkles",
          cta: { label: "Get event updates", href: "#waitlist" },
          features: [
            "Skills clinics & round-robins",
            "Tournaments & club socials",
            "Members save on every event",
            "One-off, no membership needed",
          ],
        },
      ],
    },
  ],
} as const;

export const whyUs = {
  eyebrow: "Why Us",
  heading: "Built different, on purpose.",
  items: [
    {
      title: "Badminton-first",
      body: "The courts, the ceiling height, and the community are all built around one sport.",
      icon: "Target",
    },
    {
      title: "Every level welcome",
      body: "Total beginner or tournament regular, there's a session, a clinic, and a crew for you.",
      icon: "HeartHandshake",
    },
    {
      title: "Community over transactions",
      body: "Rated play, leagues, and events designed to turn strangers into regulars.",
      icon: "Users",
    },
    {
      title: "Run by players",
      body: "Built by people who actually play, for people who actually play.",
      icon: "Medal",
    },
  ],
} as const;

export const location = {
  eyebrow: "Location",
  heading: "Based in Great Neck.",
  body: "Serving all of central Nassau: Great Neck, Manhasset, Roslyn, Mineola, Garden City, New Hyde Park, and beyond. Easy parking, easy access.",
  // ⚠️ PLACEHOLDER address — a stand-in for the map until a real site is signed.
  address: "Great Neck, NY",
  addressLabel: todo.address,
  areas: [
    "Great Neck",
    "Little Neck",
    "Bayside",
    "Douglaston",
    "Manhasset",
    "Mineola",
    "Garden City",
    "New Hyde Park",
  ],
} as const;

export const waitlist = {
  eyebrow: "Waitlist",
  heading: "Be first on the court.",
  body: "Join the waitlist for early access, founding-member perks, and opening-day updates. No spam, just news about the club.",
  button: "Notify Me",
  success: "Your place is held.",
  successNote:
    "We'll be in touch with founding-member perks and the moment we open in 2027.",
  skillLabel: "Skill level",
  skillLevels: ["Beginner", "Intermediate", "Advanced"],
  steps: [
    {
      title: "Drop your email",
      body: "Ten seconds, no commitment. You're on the list.",
    },
    {
      title: "Grab founding perks",
      body: "Waitlist members get founding-member rates and first-access booking.",
    },
    {
      title: "Play opening day",
      body: "We'll tell you the moment the doors open in 2027.",
    },
  ],
} as const;

export const faq = {
  eyebrow: "FAQ",
  heading: "Good questions.",
  items: [
    {
      q: "When are you opening?",
      a: "We're targeting 2027. Join the waitlist and we'll tell you the moment we have a date.",
    },
    {
      q: "Where will you be located?",
      a: "In the heart of Nassau County, near Great Neck. Exact address coming soon.",
    },
    {
      q: "Do I need to be good at badminton?",
      a: "No. We have open play, leagues, and (soon) coaching for total beginners.",
    },
    {
      q: "Will you have pickleball?",
      a: "No. Apollo is a dedicated badminton club. Pickle N Par opens 14 pickleball courts about five minutes away in New Hyde Park, and the corridor has no dedicated badminton. Committing all eight courts to one sport is the whole point.",
    },
    {
      q: "Can I take lessons?",
      a: "From day one you'll have structured open play and leagues. Private and group coaching will be added once our coaching staff are in place.",
    },
    {
      q: "How much will membership cost?",
      a: "Two paid tiers: Player at $59/month (15% off private court rentals, 50% off drop-in open play, 14-day advance booking) and Premier at $129/month (30% off rentals, free off-peak open play, 21-day advance booking). A free Initiate account books at list rate. Waitlist members lock in founding rates.",
    },
  ],
} as const;

/**
 * Closing epigraph.
 *
 * ATTRIBUTION MATTERS HERE. There are no authentic quotations from Apollo — he
 * is a deity, not a historical speaker, and every "Apollo quote" circulating
 * online is invented. What IS real is the Delphic maxim inscribed in the
 * forecourt of his temple at Delphi, attested by Plato and Pausanias. So the
 * attribution is to the temple, not to the god putting words in his mouth.
 *
 * It also happens to be the aptest possible line for this club: the whole
 * differentiator is the rating system that sorts players into credible skill
 * bands (see `programs`). "Know thyself" is what that system is for.
 *
 * If this is ever replaced, keep the same rule — cite a real source or write it
 * in the club's own voice unattributed. Do not attribute anything to Apollo.
 */
export const epigraph = {
  greek: "ΓΝΩΘΙ ΣΕΑΥΤΟΝ",
  line: "'Know the right moment, knowing that all other things are secondary to this.'",
  // source: "Inscribed at the Temple of Apollo, Delphi",
  // gloss:
    // "Know your level, find your match, and play the game in front of you.",
} as const;

export const footer = {
  tagline: brand.tagline,
  contact: {
    email: todo.email,
    phone: todo.phone,
  },
  social: todo.social,
  // Static founding year keeps copyright stable and build-deterministic.
  legal: `© ${2026} ${brand.legalEntity}. All rights reserved.`,
} as const;

export const siteConfig = {
  brand,
  todo,
  nav,
  hero,
  vision,
  sports,
  programs,
  pricing,
  whyUs,
  location,
  waitlist,
  faq,
  epigraph,
  footer,
} as const;

export default siteConfig;
