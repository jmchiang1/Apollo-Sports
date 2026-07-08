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
 * `brand.name` is the ONE place to change the consumer brand. The franchise
 * (Kotofit) vs. independent decision is unresolved; the working default is
 * "Apollo Racquet Club". Change it here and it updates everywhere.
 */

export const brand = {
  // Working default. Swap here if the franchise/independent decision changes.
  name: "Apollo Racquet Club",
  shortName: "Apollo",
  legalEntity: "Apollo Sports LLC",
  tagline: "Great Neck's premier badminton and pickleball club",
  // Named after Apollo — a Nassau local's English Cream Golden Retriever.
  // Drives the warm cream + caramel-gold palette.
} as const;

/** Placeholders only Jonathan confirms. Rendered as visible [TODO] tokens. */
export const todo = {
  address: "TBD",
  courts: "[TODO: exact court count & mix — planning target ~6]",
  pricing: "[TODO: pricing]",
  hours: "24/7",
  phone: "1 (917) 828 - 0104",
  email: "apollosports@gmail.com",
  opening: "Opening 2026", // brief-sanctioned soft default; confirm exact season
  social: {
    instagram: "[TODO: Instagram handle]",
    facebook: "[TODO: Facebook page]",
  },
} as const;

/**
 * Anchor navigation — id must match each section's element id.
 *
 * The two site versions expose slightly different sections, so they carry
 * their own nav lists: v1 (`nav`) has a Pricing section; the luxury build
 * (`navLuxe`) still leads with Why Us. Keep each in sync with its site's
 * actual section ids.
 */
export const nav = [
  { label: "Vision", href: "#vision" },
  { label: "Sports", href: "#sports" },
  { label: "Programs", href: "#programs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Location", href: "#location" },
  { label: "FAQ", href: "#faq" },
] as const;

/** Luxury (v2) nav — mirrors `nav` but keeps the Why Us section. */
export const navLuxe = [
  { label: "Vision", href: "#vision" },
  { label: "Sports", href: "#sports" },
  { label: "Programs", href: "#programs" },
  { label: "Why Us", href: "#why-us" },
  { label: "Location", href: "#location" },
  { label: "FAQ", href: "#faq" },
] as const;

export const hero = {
  eyebrow: `Coming to Nassau County · ${todo.opening}`,
  headline: "Great Neck's Premier Racket Club",
  subhead:
    "A badminton and pickleball led indoor racquet club in the heart of Nassau County; private bookings, open play, coaching and leagues for every level!",
  primaryCta: { label: "Join the Waitlist", href: "#waitlist" },
  secondaryCta: { label: "See what we're building", href: "#vision" },
} as const;

export const vision = {
  eyebrow: "The Vision",
  heading: "The club we always wished existed.",
  paragraphs: [
    "We're building a welcoming, well-run indoor club where badminton comes first — and where pickleball players, families, and beginners all have a court to call their own.",
    "Long Island has no shortage of places to play pickleball. What it's missing is a real home for badminton — proper courts, proper height, proper community. That's what we're here to build, with pickleball, coaching, and leagues layered on top so there's always a reason to come back.",
  ],
  founderNote:
    "Built by a lifelong player and Nassau local. We understand the club because we're the ones who've been looking for it.",
} as const;

export const sports = {
  eyebrow: "Sports & Courts",
  heading: "Two sports. One serious home for both.",
  courtsNote: todo.courts,
  cards: [
    {
      name: "Badminton",
      courts: 4,
      lead: true,
      tagline: "The lead sport.",
      body: "Regulation courts with the ceiling height and lighting the sport actually needs. Singles, doubles, mixed — from your first rally to competitive league play. This is the club badminton on Long Island deserves.",
      features: [
        "Regulation courts & true ceiling height",
        "Singles, doubles & mixed",
        "First rally to competitive league play",
      ],
    },
    {
      name: "Pickleball",
      courts: 2,
      lead: false,
      tagline: "All-season, all-weather.",
      body: "Dedicated indoor courts, all-weather, all-season. Drop in, join a game, or bring your crew. Perfect for beginners and addicts alike.",
      features: [
        "Dedicated indoor courts",
        "All-weather, all-season play",
        "Drop in or bring your crew",
      ],
    },
  ],
} as const;

/** Big-number stat strip. `courts` value is a planning estimate (see todo). */
export const stats = {
  items: [
    { value: "~6", label: "Courts", note: "planning target" },
    { value: "2", label: "Racquet sports" },
    { value: "All", label: "Levels welcome" },
    { value: "'26", label: "Opening" },
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
      note: "From $129/mo", // PLACEHOLDER — confirm before launch
      icon: "BadgeCheck",
    },
    {
      name: "Coaching & Clinics",
      body: "Private lessons and group clinics for all ages and levels, from fundamentals to competitive training.",
      icon: "GraduationCap",
    },
    {
      name: "Leagues & Tournaments",
      body: "Weekly ladders, seasonal leagues, and club tournaments. Play with purpose.",
      icon: "Trophy",
    },
    {
      name: "Youth Programming",
      body: "After-school, weekend, and holiday programs to build the next generation of players.",
      icon: "Sparkles",
    },
  ],
} as const;

/**
 * Membership & rates.
 *
 * ⚠️ PLACEHOLDER PRICING — NOT CONFIRMED. The figures below are estimates
 * benchmarked against comparable NY-metro / Long Island indoor badminton &
 * pickleball clubs (membership ~$99–$179/mo; whole-court rentals ~$30–$60/hr;
 * open-play drop-ins ~$15–$30). They're here so the section reads as a real
 * pricing page, but Jonathan must confirm each number before launch. The
 * on-page `note` already tells visitors pricing is still being finalized.
 */
export const pricing = {
  eyebrow: "Membership & Rates",
  heading: "Ways to play — and what they'll cost.",
  note: "Waitlist members lock in founding rates. Exact pricing is being finalized ahead of our 2026 opening.",
  plans: [
    {
      name: "Membership",
      tagline: "The best way to play.",
      price: "$129", // PLACEHOLDER — confirm before launch
      unit: "per month",
      featured: true,
      badge: "Most popular",
      icon: "BadgeCheck",
      cta: { label: "Join the Waitlist", href: "#waitlist" },
      features: [
        "Priority court booking",
        "Member rates on every court hour",
        "Included open-play sessions",
        "Guest passes & member-only events",
      ],
    },
    {
      name: "Private Court Booking",
      tagline: "Reserve the whole court.",
      price: "$40", // PLACEHOLDER — confirm before launch
      unit: "per hour",
      featured: false,
      badge: "",
      icon: "CalendarClock",
      cta: { label: "Get booking updates", href: "#waitlist" },
      features: [
        "Badminton or pickleball courts",
        "Book by the hour, online",
        "Peak & off-peak rates",
        "Room for a full doubles crew",
      ],
    },
    {
      name: "Open Play",
      tagline: "Show up and get matched.",
      price: "$25", // PLACEHOLDER — confirm before launch
      unit: "per drop-in",
      featured: false,
      badge: "",
      icon: "Users",
      cta: { label: "Get booking updates", href: "#waitlist" },
      features: [
        "Rated sessions by skill level",
        "Both sports, all levels",
        "No partner needed",
        "Member & drop-in pricing",
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
      body: "Not an afterthought. The courts, the height, the community are built around the sport.",
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
  heading: "Rooted in Great Neck.",
  body: "Serving all of central Nassau — Great Neck, Manhasset, Roslyn, Mineola, Garden City, New Hyde Park, and beyond. Easy parking, easy access.",
  addressLabel: todo.address,
  areas: [
    "Great Neck",
    "Manhasset",
    "Roslyn",
    "Mineola",
    "Garden City",
    "New Hyde Park",
  ],
} as const;

export const waitlist = {
  eyebrow: "Waitlist",
  heading: "Be first on the court.",
  body: "Join the waitlist for early access, founding-member perks, and opening-day updates. No spam — just news about the club.",
  button: "Notify Me",
  success: "You're on the list. We'll be in touch. 🏸",
  sportsOptions: ["Badminton", "Pickleball", "Both"],
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
      body: "We'll tell you the moment the doors open in 2026.",
    },
  ],
} as const;

export const faq = {
  eyebrow: "FAQ",
  heading: "Good questions.",
  items: [
    {
      q: "When are you opening?",
      a: "We're targeting 2026. Join the waitlist and we'll tell you the moment we have a date.",
    },
    {
      q: "Where will you be located?",
      a: "In the heart of Nassau County, near Great Neck. Exact address coming soon.",
    },
    {
      q: "Do I need to be good at badminton?",
      a: "Not at all. We have open play, clinics, and coaching for total beginners.",
    },
    {
      q: "Will you have pickleball?",
      a: "Yes — dedicated indoor pickleball courts alongside badminton.",
    },
    {
      q: "Can I take lessons?",
      a: "Yes — private and group coaching for all ages and levels.",
    },
    {
      q: "How much will membership cost?",
      a: "Early estimates: memberships around $129/month, whole-court rentals about $40/hour, and open-play drop-ins around $25. Final pricing is still being set — waitlist members lock in the lowest founding rates.",
    },
  ],
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
  navLuxe,
  hero,
  vision,
  sports,
  programs,
  pricing,
  whyUs,
  location,
  waitlist,
  faq,
  footer,
} as const;

export default siteConfig;
