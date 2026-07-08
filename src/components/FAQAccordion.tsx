"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faq } from "@/config/siteConfig";
import { SectionWrapper, Reveal } from "./Reveal";
import { TodoText } from "./Todo";
import { cn } from "@/lib/cn";
import { DogPeeking } from "./DogPeeking";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="faq-question"
      >
        <span className="faq-question-text">{q}</span>
        <span className={cn("faq-toggle", open && "faq-toggle-open")}>
          <Plus className="faq-toggle-icon" strokeWidth={2.5} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="faq-answer-wrap"
          >
            <p className="faq-answer">
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
    <SectionWrapper id="faq" className="faq-section">
      <div aria-hidden className="faq-peeking-wrap">
        <DogPeeking className="peeking-dog" />
      </div>

      <div className="faq-grid">
        <div>
          <Reveal as="h2" className="faq-heading">
            {faq.heading}
          </Reveal>
        </div>

        <Reveal>
          <div className="faq-list">
            {faq.items.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
