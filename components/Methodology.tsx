"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { METHODOLOGY_PHASES } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Methodology() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="methodology" className="bg-bone py-24 md:py-32" aria-labelledby="methodology-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={containerVariants}>
          <motion.p variants={itemVariants} className="section-label text-amber mb-4">
            The method
          </motion.p>

          <motion.h2
            id="methodology-heading"
            variants={itemVariants}
            className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-slate mb-6 max-w-3xl leading-tight"
          >
            Frame &amp; Coach → Build &amp; Teach → Read the Signal → Scale or Kill.
          </motion.h2>

          <motion.p variants={itemVariants} className="font-inter text-base md:text-lg leading-body text-steel mb-16 max-w-2xl">
            Every step is half work, half coaching. You don't hire me to do AI for you — you hire me to become someone who can. Most consulting jumps to "let's build a chatbot." I don't. The biggest leverage usually shows up two questions earlier.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {METHODOLOGY_PHASES.map((phase) => (
              <motion.div key={phase.number} variants={itemVariants} className="relative">
                <p className="font-syne font-semibold text-5xl text-amber mb-4 leading-none">{phase.number}</p>
                <div className="w-10 h-0.5 bg-amber/30 mb-5" aria-hidden="true" />
                <h3 className="font-syne font-semibold text-xl tracking-tight text-slate mb-3">{phase.title}</h3>
                <p className="font-inter text-sm leading-body text-steel">{phase.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
