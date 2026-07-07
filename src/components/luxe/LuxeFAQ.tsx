"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faq } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "@/components/Reveal";
import { TodoText } from "@/components/Todo";
import { cn } from "@/lib/cn";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-olive-ink/15">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-serif text-xl font-medium text-olive-ink sm:text-2xl">
          {q}
        </span>
        <Plus
          className={cn(
            "h-5 w-5 shrink-0 text-brass transition-transform duration-300",
            open && "rotate-45",
          )}
          strokeWidth={1.5}
        />
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
            <p className="max-w-2xl pb-6 pr-8 font-luxe text-base font-light leading-relaxed text-olive-ink/70">
              <TodoText>{a}</TodoText>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LuxeFAQ() {
  return (
    <SectionWrapper id="faq" className="bg-butter text-olive-ink">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <Reveal as="p" className="luxe-eyebrow text-brass">
            {faq.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            className="mt-6 font-serif text-4xl font-medium tracking-tight sm:text-5xl"
          >
            {faq.heading}
          </Reveal>
        </div>
        <Reveal>
          <div className="border-t border-olive-ink/15">
            {faq.items.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
