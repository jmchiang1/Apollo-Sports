import { whyUs } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { Shuttlecock } from "./Shuttlecock";
import { ApolloMascot } from "./ApolloMascot";

export function WhyUsGrid() {
  const [feature, ...rest] = whyUs.items;
  const FeatureIcon = iconMap[feature.icon as IconName];

  return (
    <SectionWrapper id="why-us" className="relative overflow-hidden bg-plum text-cream">
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
        <Reveal as="p" className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
          {whyUs.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          className="mt-4 font-display text-3xl font-extrabold tracking-tight text-cream sm:text-4xl lg:text-[3rem]"
        >
          {whyUs.heading}
        </Reveal>
      </div>

      <div className="relative mt-14 grid gap-6 lg:grid-cols-5">
        {/* big feature */}
        <Reveal className="lg:col-span-2">
          <div className="flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-cream/[0.06] p-8 ring-1 ring-cream/10">
            <div>
              <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gold text-plum">
                {FeatureIcon ? <FeatureIcon className="h-7 w-7" strokeWidth={2} /> : null}
              </span>
              <h3 className="font-display text-2xl font-extrabold text-cream sm:text-3xl">
                {feature.title}
              </h3>
              <p className="mt-3 leading-relaxed text-cream/65">{feature.body}</p>
            </div>
            <div className="flex items-center gap-3 border-t border-cream/10 pt-5">
              <ApolloMascot className="h-11 w-11 shrink-0" />
              <span className="font-display text-sm font-bold text-cream/70">
                Apollo-approved.
              </span>
            </div>
          </div>
        </Reveal>

        {/* stacked list */}
        <Reveal className="lg:col-span-3">
          <div className="flex h-full flex-col divide-y divide-cream/10 rounded-3xl bg-cream/[0.04] ring-1 ring-cream/10">
            {rest.map((item) => {
              const Icon = iconMap[item.icon as IconName];
              return (
                <div
                  key={item.title}
                  className="group flex flex-1 items-start gap-4 p-6 sm:p-7"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cream/[0.07] text-gold ring-1 ring-cream/10 transition-colors duration-300 group-hover:bg-gold group-hover:text-plum">
                    {Icon ? <Icon className="h-6 w-6" strokeWidth={2} /> : null}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-cream">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-cream/60">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
