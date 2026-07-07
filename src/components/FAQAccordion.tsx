"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faq, hero } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { TodoText } from "./Todo";
import { cn } from "@/lib/cn";
import { ButtonLink } from "./Button";
import { ApolloMascot } from "./ApolloMascot";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b-2 border-plum/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-lg font-extrabold text-ink">{q}</span>
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream-2 text-gold-deep transition-all duration-300",
            open && "rotate-45 bg-gold text-plum",
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-8 text-[1.02rem] leading-relaxed text-muted">
              <TodoText>{a}</TodoText>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQAccordion() {
  return (
    <SectionWrapper id="faq" className="bg-cream">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <Reveal
            as="h2"
            className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]"
          >
            {faq.heading}
          </Reveal>
        </div>

        <Reveal>
          <div className="border-t-2 border-plum/10">
            {faq.items.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
