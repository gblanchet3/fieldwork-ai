"use client";

import { motion } from "framer-motion";
import { Business } from "@/lib/types";

interface ForCTAProps {
  business: Pick<Business, "name" | "calendlyUrl" | "coachingUrl" | "brandColor">;
}

export default function ForCTA({ business }: ForCTAProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.55 }}
      className="border-t border-white/10 pt-8 pb-16"
      aria-label="Call to action"
    >
      <h2 className="font-syne font-semibold text-2xl md:text-3xl tracking-tight text-white mb-3">
        Ready to talk through it?
      </h2>
      <p className="font-inter text-sm leading-body mb-8" style={{ color: "rgba(240,235,225,0.55)" }}>
        Start with a free 30-minute conversation — no pitch, just an honest look at what&apos;s worth building for {business.name}.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Primary CTA */}
        <a
          href={business.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-inter text-sm font-medium bg-amber text-white px-7 py-4 hover:bg-[#C06A1F] transition-colors duration-200 text-center"
        >
          Book 30 minutes — free
        </a>

        {/* Secondary CTA — AI Coaching */}
        <a
          href={business.coachingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 font-inter text-sm px-7 py-4 border border-white/15 text-bone/60 hover:border-white/30 hover:text-bone transition-colors duration-200 text-center"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Curious how this page was built with AI?
        </a>
      </div>

      <p className="font-inter text-xs mt-5" style={{ color: "rgba(240,235,225,0.3)" }}>
        Or reach out directly:{" "}
        <a href="mailto:gblanchet3@gmail.com" className="underline hover:text-bone/60 transition-colors">
          gblanchet3@gmail.com
        </a>
      </p>
    </motion.section>
  );
}
