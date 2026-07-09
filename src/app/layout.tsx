import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { brand, hero } from "@/config/siteConfig";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://apollo-racquet-club.vercel.app"),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: hero.subhead,
  keywords: [
    "badminton",
    "pickleball",
    "Nassau County",
    "Long Island",
    "Great Neck",
    "racquet club",
    "indoor courts",
  ],
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: hero.subhead,
    type: "website",
    locale: "en_US",
    siteName: brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: hero.subhead,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${figtree.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
