"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="about" className="bg-bone py-24 md:py-32" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start"
        >
          {/* Text column */}
          <div>
            <motion.p variants={itemVariants} className="section-label text-amber mb-4">
              Who we are
            </motion.p>

            <motion.h2
              id="about-heading"
              variants={itemVariants}
              className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-slate mb-8"
            >
              Operators who build.
            </motion.h2>

            <motion.p variants={itemVariants} className="font-inter text-base leading-body text-steel mb-6">
              Fieldwork AI was founded by operators with backgrounds in product development, venture-backed startups, and SMB consulting. We've built software products from zero to acquisition, led product teams at legal SaaS companies, and helped businesses across construction, home services, and professional services run better.
            </motion.p>

            <motion.p variants={itemVariants} className="font-inter text-base leading-body text-steel">
              We don't pitch decks — we build systems.
            </motion.p>
          </div>

          {/* Photo placeholder */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div
              className="aspect-[4/3] border border-dust bg-white flex items-center justify-center"
              role="img"
              aria-label="Founder photo placeholder"
            >
              {/* TODO: Replace with <Image src="/founder.jpg" alt="Founder photo" fill className="object-cover" /> when photo is ready */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-dust mx-auto mb-3 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <circle cx="14" cy="10" r="5" stroke="#4A5568" strokeWidth="1.5" />
                    <path d="M4 27c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="font-inter text-xs text-steel/50">Founder photo</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
