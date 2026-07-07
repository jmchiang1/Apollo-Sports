import { whyUs } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { Shuttlecock } from "./Shuttlecock";

export function WhyUsGrid() {
  return (
    <SectionWrapper id="why-us" className="relative overflow-hidden bg-plum text-cream">
      {/* warm gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-[36rem] w-[36rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(228,168,53,0.5) 0%, rgba(228,168,53,0) 65%)",
        }}
      />
      <Shuttlecock
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-12 h-12 w-12 rotate-[20deg] text-cream/10"
      />

      <div className="relative max-w-2xl">
        <Reveal
          as="p"
          className="text-xs font-bold uppercase tracking-[0.16em] text-gold"
        >
          {whyUs.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          className="mt-4 font-display text-3xl font-extrabold tracking-tight text-cream sm:text-4xl lg:text-[2.9rem]"
        >
          {whyUs.heading}
        </Reveal>
      </div>

      <div className="relative mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {whyUs.items.map((item) => {
          const Icon = iconMap[item.icon as IconName];
          return (
            <Reveal key={item.title}>
              <div className="group flex h-full flex-col border-t-2 border-cream/15 pt-6">
                <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-cream/[0.07] text-gold ring-1 ring-cream/10 transition-colors duration-300 group-hover:bg-gold group-hover:text-plum">
                  {Icon ? <Icon className="h-6 w-6" strokeWidth={2} /> : null}
                </span>
                <h3 className="font-display text-lg font-extrabold text-cream">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">
                  {item.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
