import { epigraph } from "@/config/siteConfig";
import { Palmette } from "./Palmette";

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
 * No Motion `initial` anywhere, so this adds nothing to the SSR HTML's inline
 * `opacity: 0` count and reads without a bundle.
 */
export function Epigraph() {
  return (
    <section className="epigraph" aria-label="Closing inscription">
      <div className="epigraph-inner">
        <Palmette className="epigraph-mark" />
        {/* The Greek is decorative here — the English line carries the meaning,
            so screen readers get that rather than a transliteration they would
            read letter by letter. */}
        <p aria-hidden className="epigraph-greek">
          {epigraph.greek}
        </p>
        <blockquote className="epigraph-quote">
          <p className="epigraph-line">{epigraph.line}</p>
          <footer className="epigraph-source">
            <cite>{epigraph.source}</cite>
          </footer>
        </blockquote>
        <p className="epigraph-gloss">{epigraph.gloss}</p>
      </div>
    </section>
  );
}
