import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, Geist } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/siteConfig";
import { cn } from "@/lib/utils";
import { ButtonPointerGlow } from "@/components/ButtonPointerGlow";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Display face — warm, characterful grotesque with personality.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Body face — clean, friendly, comfortable line-height.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
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
      className={cn("h-full", bricolage.variable, figtree.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
        <ButtonPointerGlow />
      </body>
    </html>
  );
}
