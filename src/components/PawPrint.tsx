import type { SVGProps } from "react";

/** A dog paw print — Apollo's playful signature. Uses currentColor. */
export function PawPrint({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      {/* main pad */}
      <path d="M12 13.2c-2.7 0-4.8 1.9-4.8 4 0 1.8 1.7 2.6 4.8 2.6s4.8-.8 4.8-2.6c0-2.1-2.1-4-4.8-4Z" />
      {/* toes */}
      <ellipse cx="6.6" cy="10.6" rx="1.7" ry="2.2" />
      <ellipse cx="10.1" cy="8.1" rx="1.6" ry="2.3" />
      <ellipse cx="13.9" cy="8.1" rx="1.6" ry="2.3" />
      <ellipse cx="17.4" cy="10.6" rx="1.7" ry="2.2" />
    </svg>
  );
}
