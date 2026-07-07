# Apollo Racquet Club — pre-launch site

A single-page marketing site for a **badminton-led indoor racquet club** in
Nassau County, Long Island. Its job is to build anticipation and capture a
waitlist before the facility opens. Pickleball, coaching, open play, leagues,
and youth programming are secondary layers.

> **Brand name is a placeholder.** "Apollo Racquet Club" (named after Apollo,
> the founder's English Cream Golden Retriever — who is also the site mascot) is
> the working default while the franchise-vs-independent decision is open. Swap
> it in **one line**: `brand.name` in
> [`src/config/siteConfig.ts`](src/config/siteConfig.ts).

### Two versions + a live toggle

The site ships **two full design versions** with a floating **Playful | Luxury**
toggle (bottom-center). The choice persists in `localStorage` and can be
deep-linked with `?v=luxury`.

- **V1 — Playful** (`components/SiteOriginal.tsx`): warm/retro-casual, PKLYN-
  inspired. Flat color-block sections (cream/peach/rose/plum), chunky pill
  buttons with hard offset shadows, Apollo the retriever mascot + scattered
  shuttlecock/pickleball/paw motifs. Fonts: Bricolage Grotesque + Figtree.
- **V2 — Luxury** (`components/luxe/`): refined/upscale, Velto-inspired. Deep
  forest-green + butter-cream + brass, elegant serif display, thin gold rules,
  the triangular Apollo logo mark. Fonts: **Playfair Display** (stand-in for the
  logo's **Didot**) + **Montserrat** (stand-in for **Avenir Next**).

> **Fonts:** Didot and Avenir Next are licensed and not on Google Fonts, so V2
> uses the closest free web equivalents. To use the real faces, drop the files
> in and switch to `next/font/local` in `src/app/layout.tsx` (one place).

`src/app/page.tsx` → `<SiteSwitcher>` picks the version and renders the toggle.
Both versions share the same `siteConfig.ts` content and the `/api/waitlist`
endpoint, so they never drift.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** — theme is CSS-first in [`src/app/globals.css`](src/app/globals.css) (`@theme`), no `tailwind.config.js`
- **Motion** (`motion/react`) — scroll reveals, hero load animation, accordion
- **lucide-react** — icons
- Fonts via `next/font`: **Bricolage Grotesque** (display) + **Figtree** (body)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx            # fonts, metadata, grain overlay
│  ├─ page.tsx              # section assembly (the whole page)
│  ├─ globals.css           # Tailwind v4 @theme: cream/gold palette, fonts, motion prefs
│  ├─ icon.svg              # favicon (gold shuttlecock)
│  └─ api/waitlist/route.ts # waitlist endpoint (logs; swap for a real provider)
├─ components/              # Header, Hero, section components, cards, WaitlistForm, …
├─ config/siteConfig.ts     # ← ALL copy + every [TODO] placeholder live here
└─ lib/cn.ts                # classnames helper
```

## Placeholders (`[TODO]`)

Every value only Jonathan can confirm is a literal `[TODO: …]` string in
[`src/config/siteConfig.ts`](src/config/siteConfig.ts) and renders as a
**highlighted gold token** in the UI (see `components/Todo.tsx`) so nothing
ships unconfirmed. Fill these in before launch:

- [ ] Final brand name (franchise vs. independent)
- [ ] Facility street address (`todo.address`) + real embedded map
- [ ] Exact court count & mix (`todo.courts`)
- [ ] Membership + drop-in pricing (`todo.pricing`)
- [ ] Hours of operation (`todo.hours`)
- [ ] Contact email + phone (`todo.email`, `todo.phone`)
- [ ] Opening date/season (`todo.opening`, currently "Opening 2026")
- [ ] Social handles (`todo.social`)
- [ ] Hero photography (optional — the illustrated court graphic ships as-is)

## Waitlist form

The form posts to `POST /api/waitlist`, which currently **validates and
`console.log`s** the signup. To go live, replace the `console.log` in
[`src/app/api/waitlist/route.ts`](src/app/api/waitlist/route.ts) with one of:

- **Formspree** — forward to your form endpoint
- **Resend** — email yourself / the subscriber
- **A database** — Vercel Postgres, Supabase, etc.

The client contract (`{ name, email, sport, zip }` → `{ ok: boolean }`) stays
the same, so the UI needs no changes.

## Design notes

- **Palette & type** live in `globals.css` `@theme`. Color tokens: `cream`,
  `cream-2`, `ink`, `muted`, `peach`, `peach-soft`, `rose`, `rose-soft`, `gold`,
  `gold-deep`, `gold-soft`, `plum`, `plum-deep`. Sections are flat color blocks
  (see `page.tsx`); buttons/cards use hard offset "sticker" shadows.
- **Motion respects `prefers-reduced-motion`** — reveals resolve to fully
  visible and the hero/float animations are disabled.
- Imagery is **all self-drawn SVG** (Apollo mascot, shuttlecock, court graphic,
  pickleball, paw print, faux map) — no copyrighted photos.

## Deploy (Vercel)

```bash
npm run build      # verify a clean build
npx vercel         # first time: link + deploy
npx vercel --prod  # production
```

---

© 2026 Apollo Sports LLC (New York, DOS ID 7959872).
