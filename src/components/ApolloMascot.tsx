import type { SVGProps } from "react";

/**
 * Apollo — a friendly English Cream Golden Retriever face. The club's mascot,
 * used as a personality motif (hero, waitlist, footer). Fixed golden-retriever
 * colors so it always reads as Apollo regardless of the surrounding block.
 */
export function ApolloMascot({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 72 72"
      className={className}
      role="img"
      aria-label="Apollo, the golden retriever mascot"
      {...props}
    >
      {/* floppy ears */}
      <path d="M21 25 C10 23 7 45 19 50 C23 43 22 34 25 29 Z" fill="#cf8f39" />
      <path d="M51 25 C62 23 65 45 53 50 C49 43 50 34 47 29 Z" fill="#cf8f39" />

      {/* head */}
      <ellipse cx="36" cy="35" rx="21" ry="18" fill="#e8bd77" />
      {/* top tuft */}
      <path
        d="M28 19 Q36 12 44 19 Q40 22 36 22 Q32 22 28 19 Z"
        fill="#e8bd77"
      />

      {/* cheeks */}
      <circle cx="25" cy="40" r="3" fill="#f4a87e" opacity="0.55" />
      <circle cx="47" cy="40" r="3" fill="#f4a87e" opacity="0.55" />

      {/* muzzle */}
      <ellipse cx="36" cy="43" rx="10.5" ry="9" fill="#f7efe0" />

      {/* eyes */}
      <circle cx="29" cy="33" r="2.6" fill="#38282c" />
      <circle cx="43" cy="33" r="2.6" fill="#38282c" />
      <circle cx="29.9" cy="32.1" r="0.85" fill="#f7efe0" />
      <circle cx="43.9" cy="32.1" r="0.85" fill="#f7efe0" />

      {/* nose */}
      <ellipse cx="36" cy="39" rx="3" ry="2.3" fill="#38282c" />

      {/* mouth */}
      <path
        d="M36 41.2 V44 M36 44 Q32.5 46.6 30 44 M36 44 Q39.5 46.6 42 44"
        fill="none"
        stroke="#38282c"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* tongue */}
      <path d="M34 44.5 Q36 49 38 44.5 Z" fill="#ee8a5a" />
    </svg>
  );
}
