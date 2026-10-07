"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const VISIBLE_MS = 2400;

/** href로 가는 링크를 누르면 페이지를 옮기지 않고 "준비 중" 안내를 잠깐 띄운다. */
export function ComingSoonNotice({ href }: { href: string }) {
  const [shownAt, setShownAt] = useState<number | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.(`a[href="${href}"]`);
      if (!link) return;
      event.preventDefault();
      event.stopPropagation();
      setShownAt(Date.now());
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [href]);

  useEffect(() => {
    if (shownAt === null) return;
    const timer = window.setTimeout(() => setShownAt(null), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [shownAt]);

  return (
    <AnimatePresence>
      {shownAt !== null && (
        <motion.div
          key={shownAt}
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-x-0 bottom-28 z-50 flex justify-center px-5"
        >
          <p className="rounded-full border border-line bg-ink/90 px-5 py-3 text-sm text-paper shadow-lg backdrop-blur-md">
            상세 리포트는 준비 중이에요
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
