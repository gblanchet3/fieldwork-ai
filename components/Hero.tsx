"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PERSONAL_LEVELS } from "@/lib/constants";

const LEVEL_EVENT = "fieldwork:level-change";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.1 },
  }),
};

function readStoredPersonal(): number {
  if (typeof window === "undefined") return 2;
  try {
    const raw = window.localStorage.getItem("fw:personalLevel");
    if (raw === null) return 2;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 && n <= 5 ? n : 2;
  } catch {
    return 2;
  }
}

function readStoredCompany(): number {
  if (typeof window === "undefined") return 2;
  try {
    const raw = window.localStorage.getItem("fw:companyLevel");
    if (raw === null) return 2;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 && n <= 5 ? n : 2;
  } catch {
    return 2;
  }
}

export default function Hero() {
  const [level, setLevel] = useState(2);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLevel(readStoredPersonal());
    setHydrated(true);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ personal: number }>).detail;
      if (detail && typeof detail.personal === "number") setLevel(detail.personal);
    };
    window.addEventListener(LEVEL_EVENT, handler as EventListener);
    return () => window.removeEventListener(LEVEL_EVENT, handler as EventListener);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      const prev = window.localStorage.getItem("fw:personalLevel");
      if (prev === String(level)) return; // no change — break echo loop
      window.localStorage.setItem("fw:personalLevel", String(level));
      window.dispatchEvent(
        new CustomEvent(LEVEL_EVENT, {
          detail: { personal: level, company: readStoredCompany() },
        }),
      );
    } catch {
      // private mode / storage disabled — fail silently
    }
  }, [level, hydrated]);

  const current = PERSONAL_LEVELS[level];

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
        <motion.div initial="hidden" animate="visible" className="max-w-5xl">
          <motion.p custom={0} variants={fadeUp} className="section-label text-amber mb-6">
            Operator-led AI. In the field.
          </motion.p>

          <motion.h1
            id="hero-heading"
            custom={1}
            variants={fadeUp}
            className="font-syne font-semibold text-4xl md:text-6xl lg:text-7xl tracking-tightest text-white leading-[1.05] mb-6"
          >
            Using AI isn't the same as
            <br />
            <span className="amber-underline text-white">being AI-native.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="font-inter text-lg md:text-xl leading-body max-w-2xl mb-10"
            style={{ color: "rgba(240,235,225,0.7)" }}
          >
            Most leaders are stuck at Level 2 — daily users, zero compounding. Drag the slider. That's where this conversation starts.
          </motion.p>

          {/* Embedded mini-slider — writes to the same localStorage the full Calculator + Guarantee read */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 mb-8 max-w-3xl"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="section-label text-amber">Where do you stand?</p>
              <p className="font-syne font-semibold text-amber text-xl">Lv {level} · {current.name}</p>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value, 10))}
              className="level-slider w-full"
              aria-label="Your AI level (0 to 5)"
              style={{
                background: `linear-gradient(to right, #D97B2A 0%, #D97B2A ${(level / 5) * 100}%, rgba(255,255,255,0.12) ${(level / 5) * 100}%, rgba(255,255,255,0.12) 100%)`,
              }}
            />
            <div className="grid grid-cols-6 gap-1 mt-4">
              {PERSONAL_LEVELS.map((l) => {
                const active = level === l.level;
                return (
                  <button
                    key={l.level}
                    onClick={() => setLevel(l.level)}
                    className={`py-2 px-1 text-center transition-all flex flex-col items-center justify-start gap-1 min-h-[52px] ${
                      active ? "bg-amber text-white" : "bg-transparent text-bone/50 hover:text-white hover:bg-white/5"
                    }`}
                    aria-label={`Level ${l.level} — ${l.name}`}
                    aria-pressed={active}
                  >
                    <span className="font-syne font-semibold text-base block leading-none">{l.level}</span>
                    <span className="font-inter text-[9px] uppercase tracking-wider leading-[1.2] hidden sm:block">
                      {l.name.split(" / ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="font-inter text-sm italic text-bone/60 mt-5 leading-body">
              &ldquo;{current.oneLiner}&rdquo;
            </p>
          </motion.div>

          <motion.div custom={4} variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#calculator"
              className="font-inter text-sm font-medium bg-amber text-white px-8 py-4 hover:bg-[#C06A1F] transition-colors duration-200"
            >
              See what I&apos;d do at your level →
            </a>
            <Link
              href="/contact"
              className="font-inter text-sm font-medium border border-bone/30 text-bone px-8 py-4 hover:border-bone/60 hover:text-white transition-colors duration-200 text-center"
            >
              Talk to me
            </Link>
          </motion.div>

          <motion.p
            custom={5}
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
