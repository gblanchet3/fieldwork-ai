"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { SELECTED_WORK } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

export default function Work() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="work" className="bg-slate py-24 md:py-32" aria-labelledby="work-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={containerVariants}>
          <motion.p variants={itemVariants} className="section-label text-amber mb-4">Selected work</motion.p>
          <motion.h2
            id="work-heading"
            variants={itemVariants}
            className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-white mb-16 max-w-3xl leading-tight"
          >
            Real artifacts. Real businesses. Yours when we're done.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {SELECTED_WORK.map((w) => (
              <motion.div
                key={w.slug}
                variants={itemVariants}
                className="border border-white/10 p-8 hover:border-amber/50 transition-colors duration-300 flex flex-col"
              >
                <p className="section-label text-bone/30 mb-2">{w.kicker}</p>
                <h3 className="font-syne font-semibold text-xl text-white mb-4">{w.name}</h3>
                <p className="font-inter text-sm leading-body text-bone/60 mb-6 flex-1">{w.summary}</p>
                {w.url && (
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-inter text-xs text-amber hover:text-white transition-colors inline-flex items-center gap-1.5 mt-auto"
                  >
                    {w.url.replace(/^https?:\/\//, "")}
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants}>
            <Link
              href="/work"
              className="font-inter text-sm font-medium border border-bone/30 text-bone px-6 py-3 hover:border-bone/60 hover:text-white transition-colors inline-block"
            >
              See all work →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
