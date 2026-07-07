import { whyUs } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "@/components/Reveal";

export function LuxeWhyUs() {
  return (
    <SectionWrapper id="why-us" className="bg-forest-deep text-butter">
      <div className="max-w-2xl">
        <Reveal as="p" className="luxe-eyebrow text-brass-light">
          {whyUs.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          className="mt-6 font-serif text-4xl font-medium tracking-tight text-butter sm:text-5xl"
        >
          {whyUs.heading}
        </Reveal>
      </div>

      <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
        {whyUs.items.map((item, i) => (
          <Reveal key={item.title}>
            <div className="border-t border-brass/30 pt-6">
              <span className="font-serif text-base italic text-brass-light">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-serif text-2xl font-medium text-butter">
                {item.title}
              </h3>
              <p className="mt-3 font-luxe text-sm font-light leading-relaxed text-butter/60">
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
