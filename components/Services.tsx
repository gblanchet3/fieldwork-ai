"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SERVICES } from "@/lib/constants";

const serviceIcons = [
  // EBITDA Optimization
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="14" width="4" height="8" stroke="#D97B2A" strokeWidth="1.5" />
      <rect x="9" y="9" width="4" height="13" stroke="#D97B2A" strokeWidth="1.5" />
      <rect x="16" y="4" width="4" height="18" stroke="#D97B2A" strokeWidth="1.5" />
      <polyline points="2,12 9,7 16,2" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Knowledge
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="1" stroke="#D97B2A" strokeWidth="1.5" />
      <line x1="7" y1="8" x2="17" y2="8" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="12" x2="17" y2="12" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="16" x2="13" y2="16" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Retention
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21C12 21 3 15.5 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-9 12-9 12z" stroke="#D97B2A" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  // Exit
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#D97B2A" strokeWidth="1.5" />
      <polyline points="8,12 12,8 16,12" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="8" x2="12" y2="16" stroke="#D97B2A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
];

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
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.p variants={itemVariants} className="section-label text-amber mb-4">
            What we build
          </motion.p>

          <motion.h2
            id="services-heading"
            variants={itemVariants}
            className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-slate mb-16 max-w-2xl"
          >
            Purpose-built systems for every stage of growth.
          </motion.h2>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {SERVICES.map((service, i) => {
              const Icon = serviceIcons[i];
              return (
                <motion.div
                  key={service.title}
                  variants={itemVariants}
                  className="border border-dust bg-white p-8 md:p-10 hover:border-amber transition-colors duration-300"
                >
                  <div className="mb-5">
                    <Icon />
                  </div>
                  <h3 className="font-syne font-semibold text-lg tracking-tight text-slate mb-3">
                    {service.title}
                  </h3>
                  <p className="font-inter text-sm leading-body text-steel">
                    {service.description}
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
