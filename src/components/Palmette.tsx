import type { SVGProps } from "react";

/**
 * Palmette (anthemion) — the Greek fan ornament, drawn to echo the Apollo mark.
 *
 * WHY THIS SHAPE: the logo is five tapered blades splaying from a bound base
 * (see ApolloLogo), which is structurally the same figure as a classical
 * anthemion. Drawing the ornament from the mark rather than picking a stock
 * Greek motif is what keeps it reading as the brand's own, so keep the blade
 * count and the base band in step with the logo if that art ever changes.
 *
 * Strokes rather than the logo's filled blades: this renders at ~20px as the
 * FAQ accordion's indicator, and filled tapers turn to mud at that size. The
 * 1.6 stroke matches the meander tile's line weight so the two motifs read as
 * one family.
 *
 * Uses `currentColor`, so the colour comes from whatever it sits in.
 */
export function Palmette({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Five blades from one origin at the base. The quadratic control points
          bow each blade outward, which is what separates an anthemion from a
          plain sunburst. */}
      <path d="M12 18.6 Q12 11 12 4.2" />
      <path d="M12 18.6 Q9.1 11.8 7.2 6.6" />
      <path d="M12 18.6 Q14.9 11.8 16.8 6.6" />
      <path d="M12 18.6 Q6.2 14.6 3.3 10.4" />
      <path d="M12 18.6 Q17.8 14.6 20.7 10.4" />
      {/* The bound base, as on the mark. */}
      <path d="M8.6 21 H15.4" />
    </svg>
  );
}
