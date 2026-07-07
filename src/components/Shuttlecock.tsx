import type { SVGProps } from "react";

/** Minimal line-art shuttlecock — the club's signature mark. */
export function Shuttlecock({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* cork */}
      <circle cx="12" cy="6.1" r="3.05" fill="currentColor" stroke="none" />
      {/* feather skirt */}
      <path d="M9.2 8 L6 18.6 h12 L14.8 8" />
      {/* ribs */}
      <path d="M12 9.2 V18.6 M10.4 8.5 L8.4 18.6 M13.6 8.5 L15.6 18.6" />
      {/* bottom rim */}
      <path d="M6 18.6 q6 2.5 12 0" />
    </svg>
  );
}
