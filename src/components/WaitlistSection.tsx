import { waitlist } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { WaitlistForm } from "./WaitlistForm";
import { ApolloMascot } from "./ApolloMascot";
import { OverlayGraphic } from "./OverlayGraphic";

export function WaitlistSection() {
  return (
    <SectionWrapper id="waitlist" className="relative overflow-hidden bg-peach">
      {/* pickleball watermark bleeding off the bottom-right corner */}
      <OverlayGraphic
        src="/pickleball.svg"
        className="-bottom-24 -right-20 h-96 w-96 rotate-12"
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* how it works */}
        <div>
          <Reveal
            as="h2"
            className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
          >
            {waitlist.heading}
          </Reveal>
          <Reveal as="p" className="mt-4 max-w-md text-lg leading-relaxed text-ink/75">
            {waitlist.body}
          </Reveal>

          <Reveal>
            <ol className="mt-9 space-y-0">
              {waitlist.steps.map((step, i) => {
                const last = i === waitlist.steps.length - 1;
                return (
                  <li key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-plum font-display text-lg font-extrabold text-cream">
                        {i + 1}
                      </span>
                      {!last && <span className="my-1 w-[3px] flex-1 rounded bg-plum/20" />}
                    </div>
                    <div className={last ? "pb-0" : "pb-7"}>
                      <h3 className="font-display text-lg font-extrabold text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-1 max-w-sm text-[0.97rem] leading-relaxed text-ink/70">
                        {step.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal>
            <div className="mt-6 flex items-center gap-3">
              <ApolloMascot className="h-10 w-10 shrink-0" />
              <span className="font-display text-sm font-bold text-plum/70">
                Apollo&apos;s already on the list. 🐾
              </span>
            </div>
          </Reveal>
        </div>

        {/* form */}
        <Reveal>
          <div className="rounded-[2.5rem] border-2 border-plum/10 bg-cream p-6 shadow-[12px_12px_0_0_rgba(38,34,30,0.16)] sm:p-9">
            <WaitlistForm />
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
