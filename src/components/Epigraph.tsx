import { Fragment, type CSSProperties } from "react";
import { epigraph } from "@/config/siteConfig";
import { Palmette } from "./Palmette";
import { CarveIn } from "./Reveal";

/**
 * The closing epigraph, between the FAQ and the footer.
 *
 * TONE: onyx, deliberately the same ground as the footer. Inserting a new band
 * here would break the page's green/beige alternation whichever tone it took —
 * beige would sit against the marble FAQ, and a lone green between beige and
 * the green footer is the same problem one step along. Sharing the footer's
 * ground instead means no new band at all: the footer's own meander course
 * divides the two, the way the stats frieze divides the hero from the page.
 *
 * MOTION: `CarveIn` puts one `.is-carved` class on the section and the whole
 * sequence runs from CSS — palmette drawn blade by blade, the Greek label
 * tracking into place, then the line lighting up word by word. It pointedly
 * does NOT use the `heading-cut` wipe that every section heading uses; see the
 * note on `@keyframes epigraph-word` for why. Read the timing table in
 * globals.css before changing any of it, the steps overlap on purpose.
 *
 * The line is split into one span per word so each can carry its own delay.
 * The spaces BETWEEN the spans are real text nodes, not padding — the words are
 * `inline-block` and a space inside one would not offer a line-break
 * opportunity, so the line would stop wrapping.
 *
 * `epigraph.source` and `epigraph.gloss` are commented out in siteConfig, so
 * the attribution and gloss are not rendered. Their styles and their place in
 * the timing sequence are both still in globals.css, so uncommenting those two
 * config lines and restoring the two elements here is all it takes to get them
 * back — nothing else needs rebuilding.
 *
 * No Motion `initial` anywhere, so this still adds nothing to the SSR HTML's
 * inline `opacity: 0` count — an un-flagged epigraph is simply visible.
 */
export function Epigraph() {
  return (
    <CarveIn className="epigraph" aria-label="Closing inscription">
      <div className="epigraph-inner">
        <Palmette className="epigraph-mark" />
        {/* The Greek is decorative here — the English line carries the meaning,
            so screen readers get that rather than a transliteration they would
            read letter by letter. */}
        <p aria-hidden className="epigraph-greek">
          {epigraph.greek}
        </p>
        <blockquote className="epigraph-quote">
          <p className="epigraph-line">
            {epigraph.line.split(" ").map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span
                  className="epigraph-word"
                  style={{ "--i": i } as CSSProperties}
                >
                  {word}
                </span>
              </Fragment>
            ))}
          </p>
        </blockquote>
      </div>
    </CarveIn>
  );
}
