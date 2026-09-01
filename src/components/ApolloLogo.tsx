import { useId, type SVGProps } from "react";

/**
 * Apollo Racket Club logo mark: a shuttlecock struck from below, drawn as
 * five feather strokes over the cork. Source art is `assets/logo.svg`, inlined
 * here (rather than loaded as a file) so the gradient ids can be namespaced —
 * the mark renders three times per page (header, menu overlay, footer) and
 * duplicate ids in one document are invalid.
 *
 * Unlike the previous mark this one paints its own gold gradient instead of
 * `currentColor`, so it does NOT flip with <Wordmark invert>. That is fine:
 * the gold reads on cream and on onyx alike. Only the wordmark text inverts.
 *
 * Sized by height with `w-auto` (see `.wordmark-logo`); the art is portrait
 * (248×297), so it reads narrow at a given height.
 */
export function ApolloLogo({ className, ...props }: SVGProps<SVGSVGElement>) {
  const gradientId = useId();
  return (
    <svg
      viewBox="0 0 248 297"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="123.893"
          y1="0"
          x2="123.863"
          y2="296.936"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F6D5A5" />
          <stop offset="1" stopColor="#95784C" />
        </linearGradient>
      </defs>
      <path d="M117.322 14.2032L123.968 0L130.614 14.2032L125.678 242.718H122.004L117.322 14.2032Z" fill={`url(#${gradientId})`} />
      <path d="M37.5856 52.064L76.1927 22.2994L50.8775 50.5153L111.448 242.835L107.974 244.026L37.5856 52.064Z" fill={`url(#${gradientId})`} />
      <path d="M0 77.8064L3.59437 61.3809L93.1148 243.028L91.1177 243.992L0 77.8064Z" fill={`url(#${gradientId})`} />
      <path d="M177.514 54.6479L194.446 45.4996L139.522 243.868L136.7 243.062L177.514 54.6479Z" fill={`url(#${gradientId})`} />
      <path d="M247.786 81.8885L244.051 65.7483L156.683 243.028L158.681 243.992L247.786 81.8885Z" fill={`url(#${gradientId})`} />
      <path d="M87.7122 261.247H160.014V273.177H87.7122V261.247Z" fill={`url(#${gradientId})`} />
      <path d="M152.285 296.936H143.979C136.899 292.662 128.602 290.203 119.73 290.203C110.857 290.203 102.56 292.662 95.4805 296.936H95.4414V286.562H152.285V296.936Z" fill={`url(#${gradientId})`} />
    </svg>
  );
}
