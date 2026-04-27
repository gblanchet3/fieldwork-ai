"use client";

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
  const handleScrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-end md:items-center bg-slate overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden="true" />

      {/* Subtle radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, #0F1923 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-20 md:pt-32 md:pb-24 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
          style={{ willChange: "opacity, transform" }}
        >
          {/* Eyebrow */}
          <motion.p
            custom={0}
            variants={fadeUp}
            className="section-label text-amber mb-6"
          >
            AI consulting &amp; development for service businesses
          </motion.p>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            custom={1}
            variants={fadeUp}
            className="font-syne font-semibold text-5xl md:text-6xl lg:text-7xl tracking-tightest text-white leading-[1.05] mb-6"
          >
            Your business should be{" "}
            <span className="amber-underline text-white">
              worth more
            </span>{" "}
            than it is.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            custom={2}
            variants={fadeUp}
            className="font-inter text-lg md:text-xl leading-body max-w-2xl mb-10"
            style={{ color: "rgba(240,235,225,0.7)" }}
          >
            We build the AI systems that maximize EBITDA, eliminate key-person risk, and position your business to command a premium at exit — or just take more home every year.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => handleScrollTo("#how-it-works")}
              className="font-inter text-sm font-medium bg-amber text-white px-8 py-4 hover:bg-[#C06A1F] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              aria-label="See how it works — scroll to process section"
            >
              See how it works
            </button>
            <button
              onClick={() => handleScrollTo("#work")}
              className="font-inter text-sm font-medium border border-bone/30 text-bone px-8 py-4 hover:border-bone/60 hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              aria-label="View our work — scroll to case studies"
            >
              View our work
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0F1923)" }}
        aria-hidden="true"
      />
    </section>
  );
}
