"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PRINCIPLES } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Principles() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="principles" className="bg-slate py-24 md:py-32" aria-labelledby="principles-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={containerVariants}>
          <motion.p variants={itemVariants} className="section-label text-amber mb-4">
            What makes Fieldwork different
          </motion.p>
          <motion.h2
            id="principles-heading"
            variants={itemVariants}
            className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-white mb-16 max-w-3xl leading-tight"
          >
            Own your AI. Or someone else owns your business.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRINCIPLES.map((p, i) => (
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
        </motion.div>
      </div>
    </section>
  );
}
