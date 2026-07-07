import type { SVGProps } from "react";

/**
 * The Apollo Racquet Club logo mark: a tall triangular "A" / peak with an
 * arched base. Solid; tints via currentColor.
 */
export function ApolloMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M32 3 L10 60 Q32 31 54 60 Z" />
    </svg>
  );
}
