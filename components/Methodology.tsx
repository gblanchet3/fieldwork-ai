"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { METHODOLOGY_PILLARS } from "@/lib/constants";

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
            We show up in person, train your team, and build what&apos;s worth building.
          </motion.h2>

          <motion.p variants={itemVariants} className="font-inter text-base md:text-lg leading-body text-steel mb-16 max-w-2xl">
            Most AI consulting parachutes in, ships a chatbot, and leaves you with a tool nobody can run. I do the opposite. I work on-site with Boise teams — and three things happen. Sometimes in order. Often all at once.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {METHODOLOGY_PILLARS.map((pillar) => (
              <motion.div key={pillar.title} variants={itemVariants} className="relative">
                <div className="w-10 h-0.5 bg-amber mb-5" aria-hidden="true" />
                <h3 className="font-syne font-semibold text-xl md:text-2xl tracking-tight text-slate mb-3">{pillar.title}</h3>
                <p className="font-inter text-sm md:text-base leading-body text-steel">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
