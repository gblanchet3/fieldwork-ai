"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const metrics = [
  { label: "Full brand identity", sub: "Name, mark, visual system" },
  { label: "Custom lead machine", sub: "Estimator + funnel + GA4" },
  { label: "Back-office ops system", sub: "Sheets + Apps Script" },
];

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
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.p variants={itemVariants} className="section-label text-amber mb-4">
            Our work
          </motion.p>

          <motion.h2
            id="work-heading"
            variants={itemVariants}
            className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-white mb-16 max-w-3xl"
          >
            From zero to fully operational — in weeks.
          </motion.h2>

          {/* Case study card */}
          <motion.div
            variants={itemVariants}
            className="border border-white/10 p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
              <div>
                <p className="section-label text-bone/30 mb-2">Featured project</p>
                <h3 className="font-syne font-semibold text-2xl md:text-3xl tracking-tight text-white">
                  Rent A Pool Boise
                </h3>
                <p className="font-inter text-sm text-bone/40 mt-1">by Oasis On Tap</p>
              </div>
              <a
                href="https://rentapoolboise.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-inter text-sm font-medium text-amber hover:text-white border border-amber/40 hover:border-amber px-5 py-2.5 transition-colors duration-200 self-start"
                aria-label="Visit Rent A Pool Boise website (opens in new tab)"
              >
                rentapoolboise.com
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <p className="font-inter text-base leading-body text-bone/60 max-w-3xl mb-12">
              A Boise home-services startup came to us with a business idea and no technical infrastructure. We built the brand, the consumer marketing site, and a complete back-office operations system — including an interactive estimator with Google Maps service-area validation, early-bird pricing logic, partial lead capture, GA4 funnel tracking, and a Google Sheets back-office connected via Apps Script.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-10">
              {metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-syne font-semibold text-lg text-white mb-1">{m.label}</p>
                  <p className="font-inter text-xs text-bone/40">{m.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Closing note */}
          <motion.p
            variants={itemVariants}
            className="font-inter text-sm leading-body text-bone/40 mt-8 max-w-2xl border-l-2 border-amber/30 pl-6"
          >
            This is what we build for service businesses. The same capability — applied to your ops, your data, your exit.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
