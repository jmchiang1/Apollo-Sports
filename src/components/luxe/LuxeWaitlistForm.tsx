"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { waitlist } from "@/config/siteConfig";
import { cn } from "@/lib/cn";
import { luxeButtonClass } from "./LuxeButton";
import { ApolloMark } from "./ApolloMark";

type Status = "idle" | "submitting" | "success" | "error";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full border-b border-butter/25 bg-transparent px-0 py-3 font-luxe text-butter placeholder:text-butter/35 outline-none transition focus:border-brass-light";
const labelClass = "mb-2 block luxe-eyebrow text-butter/60";

export function LuxeWaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [sport, setSport] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const zip = String(fd.get("zip") ?? "").trim();

    if (!name) {
      setStatus("error");
      setError("Please enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, sport, zip }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-5 py-10 text-center"
          >
            <ApolloMark className="h-10 w-10 text-brass-light" />
            <p className="font-serif text-2xl italic text-butter">{waitlist.success}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={false}
            exit={{ opacity: 0 }}
            className="grid gap-7 text-left"
          >
            <div className="grid gap-7 sm:grid-cols-2">
              <div>
                <label htmlFor="lx-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="lx-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jordan Lee"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lx-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="lx-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>Sports you play</legend>
              <div className="flex flex-wrap gap-2.5">
                {waitlist.sportsOptions.map((opt) => {
                  const active = sport === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSport(active ? "" : opt)}
                      className={cn(
                        "rounded-full border px-4 py-2 font-luxe text-[0.68rem] uppercase tracking-[0.15em] transition",
                        active
                          ? "border-brass bg-brass text-ivory"
                          : "border-butter/25 text-butter/80 hover:border-butter/60",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="sm:max-w-[12rem]">
              <label htmlFor="lx-zip" className={labelClass}>
                Zip code
              </label>
              <input
                id="lx-zip"
                name="zip"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="11021"
                className={inputClass}
              />
            </div>

            {status === "error" && (
              <p className="font-luxe text-sm text-[#e2a878]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className={luxeButtonClass({ variant: "brass", size: "lg", className: "mt-1 w-full sm:w-auto" })}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Joining…
                </>
              ) : (
                waitlist.button
              )}
            </button>

            <p className="font-luxe text-xs font-light text-butter/45">
              No spam — just news about the club. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
