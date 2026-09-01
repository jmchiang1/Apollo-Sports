import { vision } from "@/config/siteConfig";
import { HeadingCut, SectionWrapper, Reveal } from "./Reveal";
import { DogPawing } from "./DogPawing";

export function VisionSection() {
  return (
    <SectionWrapper id="vision" className="vision-section">
      <div className="vision-grid">
        {/* copy */}
        <div className="vision-copy">
          <HeadingCut className="vision-heading">
            {vision.heading}
          </HeadingCut>
          <div className="vision-paragraphs">
            {vision.paragraphs.map((p, i) => (
              <Reveal as="p" key={i} className="vision-paragraph">
                {p}
              </Reveal>
            ))}
          </div>
        </div>

        {/* mascot polaroid + founder quote */}
        <div className="vision-media">
          <Reveal>
            <div className="vision-polaroid">
              <div className="vision-polaroid-frame">
                <div className="tex-fluting vision-polaroid-tex" />
                <DogPawing className="vision-polaroid-dog" />
              </div>
              <p className="vision-polaroid-caption">
                Apollo · Chief Morale Officer 🐾
              </p>
            </div>
          </Reveal>

          <Reveal>
            <figure className="vision-quote">
              <blockquote className="vision-quote-text">
                {vision.founderNote}
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
