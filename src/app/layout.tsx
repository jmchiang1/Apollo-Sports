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
        <PageLoader />
        {children}
        <ButtonPointerGlow />
      </body>
    </html>
  );
}
