import { waitlist } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { WaitlistForm } from "./WaitlistForm";
import { ApolloMascot } from "./ApolloMascot";
import { OverlayGraphic } from "./OverlayGraphic";

export function WaitlistSection() {
  return (
    <SectionWrapper id="waitlist" className="waitlist-section">
      {/* decorative watermarks that spill into the neighbouring sections */}
      <OverlayGraphic src="/pickleball.svg" className="waitlist-pickleball" />
      <OverlayGraphic src="/birdie.svg" className="waitlist-birdie" />

      <div className="waitlist-layout">
        {/* how it works */}
        <div>
          <Reveal as="h2" className="waitlist-heading">
            {waitlist.heading}
          </Reveal>
          <Reveal as="p" className="waitlist-body">
            {waitlist.body}
          </Reveal>

          <Reveal>
            <ol className="waitlist-steps">
              {waitlist.steps.map((step, i) => {
                const isLast = i === waitlist.steps.length - 1;
                return (
                  <li key={step.title} className="waitlist-step">
                    <div className="waitlist-step-rail">
                      <span className="waitlist-step-number">{i + 1}</span>
                      {!isLast && <span className="waitlist-step-connector" />}
                    </div>
                    <div
                      className={
                        isLast ? "waitlist-step-body-last" : "waitlist-step-body"
                      }
                    >
                      <h3 className="waitlist-step-title">{step.title}</h3>
                      <p className="waitlist-step-text">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal>
            <div className="waitlist-mascot-row">
              <ApolloMascot className="waitlist-mascot" />
              <span className="waitlist-mascot-note">
                Apollo&apos;s already on the list. 🐾
              </span>
            </div>
          </Reveal>
        </div>

        {/* form */}
        <Reveal>
          <div className="waitlist-form-card">
            <WaitlistForm />
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
