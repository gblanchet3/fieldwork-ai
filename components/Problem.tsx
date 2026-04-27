"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PAIN_POINTS } from "@/lib/constants";

const ChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <polyline points="2,22 10,12 16,17 26,6" stroke="#D97B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="2" y1="26" x2="26" y2="26" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PersonIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="9" r="5" stroke="#D97B2A" strokeWidth="2" />
    <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#D97B2A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ScaleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <line x1="14" y1="4" x2="14" y2="24" stroke="#D97B2A" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="24" x2="26" y2="24" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 12 L2 20 L10 20 Z" stroke="#D97B2A" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M22 12 L18 20 L26 20 Z" stroke="#D97B2A" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="6" y1="12" x2="22" y2="12" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6" y1="12" x2="14" y2="4" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="12" x2="14" y2="4" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const icons = { chart: ChartIcon, person: PersonIcon, scale: ScaleIcon };

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
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Section label */}
          <motion.p variants={itemVariants} className="section-label text-amber mb-4">
            The problem
          </motion.p>

          <motion.h2
            id="problem-heading"
            variants={itemVariants}
            className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-slate mb-16 max-w-2xl"
          >
            Most service businesses are worth a fraction of what they could be.
          </motion.h2>

          {/* Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {PAIN_POINTS.map((point) => {
              const Icon = icons[point.icon as keyof typeof icons];
              return (
                <motion.div
                  key={point.title}
                  variants={itemVariants}
                  className="border border-dust bg-white p-8 hover:border-amber transition-colors duration-300 group"
                >
                  <div className="mb-6">
                    <Icon />
                  </div>
                  <h3 className="font-syne font-semibold text-lg tracking-tight text-slate mb-3 leading-snug">
                    {point.title}
                  </h3>
                  <p className="font-inter text-sm leading-body text-steel">
                    {point.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
