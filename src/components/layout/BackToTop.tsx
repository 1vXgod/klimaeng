"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useScrolled } from "@/lib/hooks";

/**
 * Floating "back to top" control. Sits directly above the chat launcher in
 * the bottom-right stack; the open chat window (higher z) covers it, and the
 * compare bar keeps clear of this column by design.
 */
export function BackToTop() {
  const visible = useScrolled(600);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 8 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Kthehu në krye të faqes"
          className="glass fixed right-4 bottom-[5.5rem] z-60 grid h-11 w-11 place-items-center rounded-full border border-line text-ink-2 card-shadow transition-colors hover:border-brand-300 hover:text-brand-600 focus-ring sm:right-6 sm:bottom-[6.25rem] dark:hover:text-brand-300"
        >
          <ArrowUp size={19} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
