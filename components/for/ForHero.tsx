"use client";

import { motion } from "framer-motion";
import { Business } from "@/lib/types";

interface ForHeroProps {
  business: Business;
}

export default function ForHero({ business }: ForHeroProps) {
  const opportunityCount = business.opportunities.length;

  return (
    <section className="relative bg-slate overflow-hidden pt-14 pb-16 md:pb-20">
      {/* Subtle hero photo background */}
      {business.heroPhotoUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
            style={{ backgroundImage: `url(${business.heroPhotoUrl})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, #0F1923 0%, transparent 40%, #0F1923 100%)" }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Eyebrow */}
          <p className="section-label text-amber mb-8">
            Fieldwork AI — AI analysis
          </p>

          {/* Business identity */}
          <div className="flex items-center gap-4 mb-6">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={`${business.name} logo`}
                className="w-12 h-12 rounded object-contain bg-white/10 p-1"
              />
            ) : (
              <div
                className="w-12 h-12 rounded flex items-center justify-center text-white font-syne font-semibold text-lg"
                style={{ backgroundColor: business.brandColor || "#D97B2A" }}
                aria-hidden="true"
              >
                {business.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-syne font-semibold text-2xl md:text-3xl tracking-tight text-white leading-tight">
                {business.name}
              </h1>
              <p className="font-inter text-sm" style={{ color: "rgba(240,235,225,0.5)" }}>
                {business.city}
              </p>
            </div>
          </div>

          {/* Rating block */}
          {business.googleRating > 0 && (
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#D97B2A" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-inter font-medium text-sm text-white">{business.googleRating}</span>
              </div>
              <span className="font-inter text-sm" style={{ color: "rgba(240,235,225,0.4)" }}>
                {business.reviewCount.toLocaleString()} Google reviews
              </span>
            </div>
          )}

          {/* Hook */}
          <p className="font-syne font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tighter text-white leading-[1.1] mb-4">
            We found{" "}
            <span style={{ color: business.brandColor || "#D97B2A" }}>
              {opportunityCount} AI {opportunityCount === 1 ? "opportunity" : "opportunities"}
            </span>{" "}
            for {business.name}.
          </p>

          <p className="font-inter text-base md:text-lg leading-body max-w-xl" style={{ color: "rgba(240,235,225,0.65)" }}>
            We looked at your business before reaching out — your reviews, website, and online presence. Here's what we found.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
