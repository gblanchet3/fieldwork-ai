"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PERSONAL_LEVELS } from "@/lib/constants";

const LEVEL_EVENT = "fieldwork:level-change";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const PROOFS = [
  {
    title: "Move up the scale.",
    body: "Day 1, you rate yourself on the 0–5 AI-Native scale. Day 30, you rate yourself again. You'll have moved up at least one level — or you don't pay the final invoice.",
  },
  {
    title: "A six-figure bet.",
    body: "By Day 30 you'll have a quantified AI bet — modeled, validated, signed off by you — worth six figures in revenue or efficiency on your business. Something you can defend to your board.",
  },
  {
    title: "An artifact you built.",
    body: "Not a deliverable I handed you — an artifact you built with your own hands during the engagement. Portable, forkable, yours. The proof you can do it again without me.",
  },
];

function readStoredLevel(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("fw:personalLevel");
    if (raw === null) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 && n <= 5 ? n : null;
  } catch {
    return null;
  }
}

export default function Guarantee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [level, setLevel] = useState<number | null>(null);

  useEffect(() => {
    setLevel(readStoredLevel());
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ personal: number }>).detail;
      if (detail && typeof detail.personal === "number") setLevel(detail.personal);
    };
    window.addEventListener(LEVEL_EVENT, handler as EventListener);
    return () => window.removeEventListener(LEVEL_EVENT, handler as EventListener);
  }, []);

  const targetLevel = level !== null && level < 5 ? level + 1 : null;
  const currentName = level !== null ? PERSONAL_LEVELS[level]?.name : null;
  const targetName = targetLevel !== null ? PERSONAL_LEVELS[targetLevel]?.name : null;

  return (
    <section id="guarantee" className="bg-olive py-24 md:py-32" aria-labelledby="guarantee-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={containerVariants}>
          <motion.p variants={itemVariants} className="section-label text-amber mb-4">
            The AI-Native Guarantee
          </motion.p>
          <motion.h2
            id="guarantee-heading"
            variants={itemVariants}
            className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-white mb-6 max-w-4xl leading-tight"
          >
            30 days to become measurably more AI-native — or you don't pay the final invoice.
          </motion.h2>

          <motion.p variants={itemVariants} className="font-inter text-base md:text-lg leading-body text-bone/70 mb-10 max-w-3xl">
            Three proof points. Not my opinion — yours, your board's, and your own hands. If you haven't moved up the scale by Day 30, the final invoice is voided and I keep working until you do, on me.
          </motion.p>

          {level !== null && currentName && (
            <motion.div
              variants={itemVariants}
              className="mb-12 border-l-2 border-amber bg-white/5 pl-6 py-5 max-w-3xl"
            >
              <p className="section-label text-amber mb-2">Your starting line</p>
              <p className="font-inter text-base text-white leading-body">
                You rated yourself <span className="text-amber font-syne font-semibold">Lv {level} · {currentName}</span>.
                {targetLevel !== null && targetName ? (
                  <> By Day 30, you'll be at <span className="text-amber font-syne font-semibold">Lv {targetLevel} · {targetName}</span> — or this engagement isn't done.</>
                ) : (
                  <> You're already at the top. The guarantee for you is sparring partner energy, not training wheels.</>
                )}
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROOFS.map((p, i) => (
              <motion.div
                key={p.title}
                variants={itemVariants}
                className="border border-white/10 p-8 md:p-10 hover:border-amber/50 transition-colors duration-300"
              >
                <p className="font-syne font-semibold text-amber text-3xl mb-6">0{i + 1}</p>
                <h3 className="font-syne font-semibold text-xl tracking-tight text-white mb-4 leading-snug">
                  {p.title}
                </h3>
                <p className="font-inter text-sm leading-body text-bone/60">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>

          {level === null && (
            <motion.p variants={itemVariants} className="font-inter text-sm italic text-bone/50 mt-12 border-l-2 border-amber/40 pl-4 max-w-2xl">
              Haven't rated yourself yet? Scroll up — the calculator at the top of this page is the same one the guarantee runs on.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
