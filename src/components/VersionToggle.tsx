"use client";

import { cn } from "@/lib/cn";

export type Version = "v1" | "v2";

const OPTIONS: { id: Version; label: string }[] = [
  { id: "v1", label: "Playful" },
  { id: "v2", label: "Luxury" },
];

/** Floating segmented control to switch site versions. */
export function VersionToggle({
  version,
  onChange,
}: {
  version: Version;
  onChange: (v: Version) => void;
}) {
  return (
    <div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/15 bg-neutral-900/80 p-1 shadow-2xl backdrop-blur-md">
        <span className="pl-3 pr-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/40">
          Version
        </span>
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={version === opt.id}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              version === opt.id
                ? "bg-white text-neutral-900"
                : "text-white/70 hover:text-white",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
