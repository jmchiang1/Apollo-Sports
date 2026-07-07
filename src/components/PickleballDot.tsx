import type { SVGProps } from "react";

/** A pickleball — circle with holes. Uses currentColor for the ball. */
export function PickleballDot({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="11" />
      <g fill="rgba(0,0,0,0.16)">
        <circle cx="12" cy="6" r="1.5" />
        <circle cx="7" cy="9.5" r="1.5" />
        <circle cx="17" cy="9.5" r="1.5" />
        <circle cx="9" cy="15" r="1.5" />
        <circle cx="15" cy="15" r="1.5" />
        <circle cx="12" cy="18.5" r="1.5" />
      </g>
    </svg>
  );
}
