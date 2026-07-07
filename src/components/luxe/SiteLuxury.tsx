import { LuxeHeader } from "./LuxeHeader";
import { LuxeHero } from "./LuxeHero";
import { LuxeVision } from "./LuxeVision";
import { LuxeSports } from "./LuxeSports";
import { LuxePrograms } from "./LuxePrograms";
import { LuxeWhyUs } from "./LuxeWhyUs";
import { LuxeLocation } from "./LuxeLocation";
import { LuxeWaitlist } from "./LuxeWaitlist";
import { LuxeFAQ } from "./LuxeFAQ";
import { LuxeFooter } from "./LuxeFooter";

/** Version 2 — the luxury, Velto-style site. */
export function SiteLuxury() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-forest font-luxe">
      <LuxeHeader />
      <main className="flex-1">
        <LuxeHero />
        <LuxeVision />
        <LuxeSports />
        <LuxePrograms />
        <LuxeWhyUs />
        <LuxeLocation />
        <LuxeWaitlist />
        <LuxeFAQ />
      </main>
      <LuxeFooter />
    </div>
  );
}
