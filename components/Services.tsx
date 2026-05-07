"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { SERVICES_OVERVIEW } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="services" className="bg-bone py-24 md:py-32" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={containerVariants}>
          <motion.p variants={itemVariants} className="section-label text-amber mb-4">What I do</motion.p>
          <motion.h2
            id="services-heading"
            variants={itemVariants}
            className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-slate mb-16 max-w-2xl leading-tight"
          >
            Three ways to work together.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES_OVERVIEW.map((s) => (
              <motion.div key={s.title} variants={itemVariants}>
                <Link
                  href={s.href}
                  className="block border border-dust bg-white p-8 md:p-10 hover:border-amber transition-colors duration-300 h-full group"
                >
                  <p className="section-label text-amber mb-3">{s.kicker}</p>
                  <h3 className="font-syne font-semibold text-2xl tracking-tight text-slate mb-4 group-hover:text-amber transition-colors">
                    {s.title}
                  </h3>
                  <p className="font-inter text-sm leading-body text-steel mb-6">
                    {s.description}
                  </p>
                  <div className="pt-5 border-t border-dust flex items-baseline justify-between gap-3">
                    <p className="font-syne font-semibold text-sm text-slate">{s.pricing}</p>
                    <p className="font-inter text-xs text-amber group-hover:translate-x-1 transition-transform">→</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p variants={itemVariants} className="font-inter text-sm text-steel/70 italic mt-10 max-w-2xl border-l-2 border-amber/40 pl-5">
            All deliverables are yours to keep — code, docs, prompts, configs. No retainer required after handoff.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
