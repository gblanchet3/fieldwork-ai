"use client";

import { motion } from "framer-motion";
import socialProofData from "@/data/social-proof.json";
import { Business } from "@/lib/types";

interface SocialProofProps {
  business: Pick<Business, "vertical" | "brandColor">;
}

export default function SocialProof({ business }: SocialProofProps) {
  const proof = socialProofData[business.vertical as keyof typeof socialProofData] ?? socialProofData.other;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
      className="bg-white/[0.03] border border-white/10 p-6 md:p-8"
      aria-label="Social proof"
    >
      <p className="section-label text-amber mb-4">In practice</p>

      {/* Big stat */}
      <p
        className="font-syne font-semibold text-2xl md:text-3xl tracking-tight mb-4"
        style={{ color: business.brandColor || "#D97B2A" }}
      >
        {proof.stat}
      </p>

      <p className="font-inter text-sm leading-body" style={{ color: "rgba(240,235,225,0.6)" }}>
        {proof.story}
      </p>
    </motion.section>
  );
}
