"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="problem" className="bg-bone py-24 md:py-32" aria-labelledby="problem-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={containerVariants}>
          <motion.p variants={itemVariants} className="section-label text-amber mb-4">
            The problem
          </motion.p>

          <motion.h2
            id="problem-heading"
            variants={itemVariants}
            className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-slate mb-10 max-w-3xl leading-tight"
          >
            The AI revolution is happening. Most people are watching it on a webinar.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 max-w-5xl">
            <motion.div variants={itemVariants}>
              <p className="font-inter text-base md:text-lg leading-body text-steel mb-5">
                Three things are true at once. The tools are getting better every month. The cost of building is collapsing. And the gap between people who <em>use</em> AI and people who <em>operate</em> it is widening fast.
              </p>
              <p className="font-inter text-base md:text-lg leading-body text-steel">
                Most of what's on offer doesn't help you cross that gap. Online courses you'll never finish. SaaS wrappers that lock your data behind someone else's UI. Big-firm consultants who hand you a deck and disappear. Vibe-coded prototypes nobody can maintain.
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="font-inter text-base md:text-lg leading-body text-steel mb-5">
                You don't need any of that.
              </p>
              <p className="font-inter text-base md:text-lg leading-body text-steel mb-5">
                You need someone who sits beside you, builds <em>with</em> you, and leaves you with artifacts you own — your data, your prompts, your context, your code. Portable. Forkable. Yours.
              </p>
              <p className="font-syne font-semibold text-xl text-slate">
                That's what I do.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
