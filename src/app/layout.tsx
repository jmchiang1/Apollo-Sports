import type { Metadata } from "next";
import { Manrope, Marcellus } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/siteConfig";
import { cn } from "@/lib/utils";
import { ButtonPointerGlow } from "@/components/ButtonPointerGlow";
import { PageLoader } from "@/components/PageLoader";

// Body face — Manrope carries everything that is not a title.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Title face — Marcellus. NOTE: it ships a SINGLE weight (400). Any bold
// utility on a Marcellus element makes the browser synthesise a fake bold,
// which smears a serif, so display type is pinned to 400 (see globals.css).
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const META_DESCRIPTION =
  "A dedicated indoor badminton club in central Nassau County: 8 courts, open play, leagues, and memberships for every level.";

export const metadata: Metadata = {
  metadataBase: new URL("https://apolloracketclub.com"),
  title: {
    default: `${brand.name} · ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: META_DESCRIPTION,
  keywords: [
    "badminton",
    "Nassau County",
    "Long Island",
    "Great Neck",
    "New Hyde Park",
    "indoor badminton courts",
  ],
  openGraph: {
    title: `${brand.name} · ${brand.tagline}`,
    description: META_DESCRIPTION,
    type: "website",
    locale: "en_US",
    siteName: brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} · ${brand.tagline}`,
    description: META_DESCRIPTION,
  },
};

/**
 * Runs during HTML parse — see the note where it is rendered for why it cannot
 * be an effect or a `next/script`. Kept as a string constant so the layout's
 * JSX stays readable.
 */
const SCROLL_TO_TOP_ON_RELOAD = `(function () {
  try {
    var nav = performance.getEntriesByType("navigation")[0];
    if (!nav || nav.type !== "reload") return;
    // An explicit fragment is a deliberate destination, so a refresh of
    // /#pricing stays on pricing. Only an offset-restoring reload is reset.
    if (location.hash) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // SETTING "manual" IS NOT ENOUGH ON ITS OWN. Measured: on the first
    // refresh of an entry Chrome had already committed its restore before this
    // script ran, landing at 5200px with scrollRestoration reading "manual" —
    // it only held from the SECOND refresh on, once the entry was already
    // manual. The restore also lands late, after streamed content grows the
    // document, so a single scrollTo here runs against a zero-height page and
    // does nothing. Hence re-asserting the top at each point the height can
    // change.
    var stop = false;
    ["wheel", "touchstart", "keydown"].forEach(function (evt) {
      addEventListener(evt, function () { stop = true; }, { once: true, passive: true });
    });
    function top() { if (!stop) window.scrollTo(0, 0); }
    top();
    document.addEventListener("DOMContentLoaded", top);
    addEventListener("load", function () {
      top();
      requestAnimationFrame(top);
    });
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // NOTE: never set overflow on <html> — a non-visible value here stops
    // body's overflow-x from propagating to the viewport, which turns body
    // into a scroll container and silently breaks every position:sticky
    // descendant (the hero pin). Sideways clipping lives on body instead.
    <html
      lang="en"
      className={cn("h-full", manrope.variable, marcellus.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col bg-onyx text-ink">
        {/*
          A refresh must land at the top of the page.

          Browsers default `history.scrollRestoration` to "auto" and put a
          reload back at its previous offset — measured 5200px on this page.
          That is wrong here specifically: the hero is a PINNED scroll
          fly-over and the brand intro plays on every load, so restoring a
          mid-page offset drops you into a half-run animation behind a loader
          that is animating something you cannot see.

          A RAW PARSE-TIME SCRIPT, not `next/script` and not an effect. This
          has to beat the browser's own restore, which happens as soon as the
          document is scrollable — long before hydration, so an effect in a
          client component is far too late. Inline in the body's head position
          it runs during parse, before there is anything to scroll.

          Scoped to `nav.type === "reload"` so back/forward keeps its normal
          restore behaviour, which is what people expect from those buttons.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: SCROLL_TO_TOP_ON_RELOAD,
          }}
        />
        <PageLoader />
        {children}
        <ButtonPointerGlow />
      </body>
    </html>
  );
}
