"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STEPS } from "@/lib/constants";

function CountUp({ target, inView }: { target: string; inView: boolean }) {
  const [display, setDisplay] = useState("00");

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target, 10);
    let frame = 0;
    const total = 40;
    const timer = setInterval(() => {
      frame++;
      const val = Math.round((frame / total) * num);
      setDisplay(val.toString().padStart(2, "0"));
      if (frame >= total) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span>{display}</span>;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const stackItems = [
  { label: "EBITDA Baseline", pct: 40 },
  { label: "+ Margin Gains", pct: 60 },
  { label: "+ Systems Premium", pct: 80 },
  { label: "= Exit Value", pct: 100, highlight: true },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const stackRef = useRef(null);
  const stackInView = useInView(stackRef, { once: true, margin: "-10%" });

  return (
    <section
      id="how-it-works"
      className="bg-slate py-24 md:py-32"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.p variants={itemVariants} className="section-label text-amber mb-4">
            How it works
          </motion.p>

          <motion.h2
            id="how-it-works-heading"
            variants={itemVariants}
            className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-white mb-16 max-w-2xl"
          >
            We build systems that run without you.
          </motion.h2>

          {/* Steps */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-20"
          >
            {STEPS.map((step) => (
              <motion.div key={step.number} variants={itemVariants} className="relative">
                <div className="font-syne font-semibold text-5xl text-amber mb-6 leading-none">
                  <CountUp target={step.number} inView={inView} />
                </div>
                <div className="w-10 h-0.5 bg-amber/30 mb-6" aria-hidden="true" />
                <h3 className="font-syne font-semibold text-xl tracking-tight text-white mb-3">
                  {step.title}
                </h3>
                <p className="font-inter text-sm leading-body text-bone/60">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Value stack diagram */}
          <motion.div
            ref={stackRef}
            initial="hidden"
            animate={stackInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="border border-white/10 p-8 md:p-12"
            aria-label="Value stack: from EBITDA baseline to exit value"
          >
            <motion.p variants={itemVariants} className="section-label text-bone/40 mb-8">
              Value stack
            </motion.p>
            <div className="space-y-4">
              {stackItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  custom={i}
                  className="flex items-center gap-4"
                >
                  <span
                    className={`font-inter text-xs font-medium w-36 shrink-0 ${item.highlight ? "text-amber" : "text-bone/50"}`}
                  >
                    {item.label}
                  </span>
                  <div className="flex-1 h-2 bg-white/5 rounded-none overflow-hidden">
                    <motion.div
                      className={`h-full ${item.highlight ? "bg-amber" : "bg-white/20"}`}
                      initial={{ width: 0 }}
                      animate={stackInView ? { width: `${item.pct}%` } : { width: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
