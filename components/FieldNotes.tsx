"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SUBSTACK_URL } from "@/lib/constants";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function FieldNotes() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="field-notes" className="bg-bone py-20 md:py-28 border-t border-dust" aria-labelledby="fieldnotes-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start"
        >
          <div>
            <motion.p variants={itemVariants} className="section-label text-amber mb-4">Field Notes</motion.p>
            <motion.h2
              id="fieldnotes-heading"
              variants={itemVariants}
              className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-slate mb-6 leading-tight"
            >
              Things I'm thinking about. Posted occasionally.
            </motion.h2>
            <motion.p variants={itemVariants} className="font-inter text-base leading-body text-steel mb-8 max-w-md">
              Short, opinionated essays on AI implementation, sovereignty, and the messy reality of operating with these tools. No newsletter spam. Posted when I have something worth saying.
            </motion.p>
            <motion.a
              variants={itemVariants}
              href={SUBSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-sm font-medium bg-slate text-white px-6 py-3 hover:bg-olive transition-colors duration-200 inline-flex items-center gap-2"
            >
              Read Field Notes
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </div>

          <motion.div variants={itemVariants} className="border border-dust bg-white p-8 md:p-10">
            <p className="section-label text-amber mb-4">Latest</p>
            <p className="font-syne font-semibold text-lg text-slate mb-3 leading-snug">
              Subscribe at gabeblanchet.substack.com
            </p>
            <p className="font-inter text-sm leading-body text-steel mb-6">
              Field Notes is hosted on Substack. New posts go out there as I write them.
            </p>
            <a
              href={SUBSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-sm text-amber hover:text-slate transition-colors inline-flex items-center gap-1.5"
            >
              gabeblanchet.substack.com
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
