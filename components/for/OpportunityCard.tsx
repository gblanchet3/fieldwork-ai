"use client";

import { motion } from "framer-motion";
import { Opportunity } from "@/lib/types";

interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
  brandColor: string;
}

export default function OpportunityCard({ opportunity, index, brandColor }: OpportunityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      className="relative border border-white/10 bg-white/[0.03] p-6 md:p-8"
      style={{ borderLeftColor: brandColor, borderLeftWidth: "3px" }}
    >
      {/* Label */}
      <p
        className="section-label mb-4"
        style={{ color: brandColor }}
      >
        {opportunity.label}
      </p>

      {/* Signal */}
      <div className="mb-5 flex gap-3">
        <div
          className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: brandColor }}
          aria-hidden="true"
        />
        <p className="font-inter text-sm leading-body" style={{ color: "rgba(240,235,225,0.5)" }}>
          <span className="font-medium" style={{ color: "rgba(240,235,225,0.7)" }}>What we found: </span>
          {opportunity.signal}
        </p>
      </div>

      {/* Observation + Fix */}
      <div className="space-y-3 pl-4 border-l border-white/10">
        <p className="font-inter text-sm leading-body text-bone/80">
          {opportunity.observation}
        </p>
        <p className="font-inter text-sm leading-body" style={{ color: "rgba(240,235,225,0.5)" }}>
          <span className="font-medium text-amber">The AI fix: </span>
          {opportunity.fix}
        </p>
      </div>
    </motion.div>
  );
}
