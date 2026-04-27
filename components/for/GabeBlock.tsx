"use client";

import { motion } from "framer-motion";

const credentials = [
  "MIT Mechanical Engineering",
  "Forbes 30 Under 30",
  "Grove Labs — Co-founder",
  "LeanLaw — Head of Product",
];

export default function GabeBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
      className="border-t border-white/10 pt-8"
      aria-label="About Gabe"
    >
      <div className="flex items-start gap-5">
        {/* Avatar placeholder */}
        <div className="w-12 h-12 rounded-full bg-olive flex items-center justify-center shrink-0">
          <span className="font-syne font-semibold text-bone text-sm" aria-hidden="true">GB</span>
        </div>

        <div>
          <p className="font-syne font-semibold text-white text-lg tracking-tight leading-tight mb-0.5">
            Gabe Blanchet
          </p>
          <p className="font-inter text-sm mb-3" style={{ color: "rgba(240,235,225,0.45)" }}>
            Founder, Fieldwork AI · Boise, Idaho
          </p>
          <p className="font-inter text-sm leading-body mb-4" style={{ color: "rgba(240,235,225,0.6)" }}>
            I build this stuff — I don&apos;t just advise on it. A decade shipping AI-powered products, from venture-backed startups to SMB SaaS. Based in Boise, working with service businesses that are ready to use AI seriously.
          </p>

          {/* Credential tags */}
          <div className="flex flex-wrap gap-2">
            {credentials.map((cred) => (
              <span
                key={cred}
                className="font-inter text-[11px] font-medium px-2.5 py-1 border border-white/15 text-bone/50"
              >
                {cred}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
