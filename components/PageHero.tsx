"use client";

import { motion } from "framer-motion";

export default function PageHero({
  eyebrow,
  title,
  subhead,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subhead?: string;
}) {
  return (
    <section className="relative bg-slate pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 30%, transparent 40%, #0F1923 100%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="section-label text-amber mb-5">{eyebrow}</p>
          <h1 className="font-syne font-semibold text-4xl md:text-6xl tracking-tightest text-white leading-[1.05] mb-6 max-w-4xl">
            {title}
          </h1>
          {subhead && (
            <p className="font-inter text-lg leading-body text-bone/70 max-w-2xl">{subhead}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
