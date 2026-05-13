"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.12 },
  }),
};

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-end md:items-center bg-slate overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, #0F1923 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-20 md:pt-32 md:pb-24 w-full">
        <motion.div initial="hidden" animate="visible" className="max-w-4xl">
          <motion.p custom={0} variants={fadeUp} className="section-label text-amber mb-6">
            Operator-led AI. In the field.
          </motion.p>

          <motion.h1
            id="hero-heading"
            custom={1}
            variants={fadeUp}
            className="font-syne font-semibold text-5xl md:text-6xl lg:text-7xl tracking-tightest text-white leading-[1.05] mb-6"
          >
            Using AI isn&apos;t the same as
            <br />
            <span className="amber-underline text-white">being AI-native.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="font-inter text-lg md:text-xl leading-body max-w-2xl mb-10"
            style={{ color: "rgba(240,235,225,0.7)" }}
          >
            Find your level — and your org&apos;s. Most leaders are stuck at Level 2.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#calculator"
              className="font-inter text-sm font-medium bg-amber text-white px-8 py-4 hover:bg-[#C06A1F] transition-colors duration-200"
            >
              Find your level →
            </a>
            <Link
              href="/contact"
              className="font-inter text-sm font-medium border border-bone/30 text-bone px-8 py-4 hover:border-bone/60 hover:text-white transition-colors duration-200 text-center"
            >
              Talk to me
            </Link>
          </motion.div>

          <motion.p
            custom={4}
            variants={fadeUp}
            className="font-inter text-sm mt-8"
            style={{ color: "rgba(240,235,225,0.5)" }}
          >
            MIT engineer. Built and sold companies. Now in the field with operators.
          </motion.p>
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0F1923)" }}
        aria-hidden="true"
      />
    </section>
  );
}
