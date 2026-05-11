"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PERSONAL_LEVELS, COMPANY_LEVELS, type LevelData } from "@/lib/constants";

type Track = "personal" | "company";

const PersonIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
    <path d="M3 22c0-5 4-9 9-9s9 4 9 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const TeamIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="17" cy="9" r="3" stroke="currentColor" strokeWidth="1.75" />
    <path d="M2 22c0-4 3.5-7 7-7s7 3 7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M14 17c1-2 3-3 5-3s3 1 3 3v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

function LevelTrack({
  track,
  levels,
  value,
  setValue,
}: {
  track: Track;
  levels: LevelData[];
  value: number;
  setValue: (n: number) => void;
}) {
  const current = levels[value];
  const isPersonal = track === "personal";
  const Icon = isPersonal ? PersonIcon : TeamIcon;
  const tag = isPersonal ? "FOR YOU" : "FOR YOUR ORG";
  const heading = isPersonal ? "Where do I stand?" : "Where do we stand?";
  const subtext = isPersonal ? "Personal AI fluency" : "Company AI maturity";

  return (
    <div className="border border-white/10 bg-white/5 backdrop-blur-sm">
      {/* Track header */}
      <div className="px-6 md:px-8 py-5 border-b border-white/10 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-amber/15 text-amber flex items-center justify-center shrink-0">
          <Icon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-label text-amber mb-0.5">{tag}</p>
          <h3 className="font-syne font-semibold text-xl md:text-2xl tracking-tight text-white leading-tight">
            {heading}
          </h3>
        </div>
        <p className="font-inter text-xs text-bone/40 hidden sm:block shrink-0">{subtext}</p>
      </div>

      {/* Slider area */}
      <div className="px-6 md:px-8 pt-8 pb-2">
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10))}
          className="level-slider w-full"
          aria-label={`${track} AI level (0 to 5)`}
          style={{
            background: `linear-gradient(to right, #D97B2A 0%, #D97B2A ${(value / 5) * 100}%, rgba(255,255,255,0.12) ${(value / 5) * 100}%, rgba(255,255,255,0.12) 100%)`,
          }}
        />

        {/* Pill row — clickable, big targets */}
        <div className="grid grid-cols-6 gap-1 mt-5">
          {levels.map((l) => {
            const active = value === l.level;
            return (
              <button
                key={l.level}
                onClick={() => setValue(l.level)}
                className={`py-2.5 px-1 text-center transition-all flex flex-col items-center justify-start gap-1 min-h-[60px] ${
                  active
                    ? "bg-amber text-white"
                    : "bg-transparent text-bone/50 hover:text-white hover:bg-white/5"
                }`}
                aria-label={`Level ${l.level} — ${l.name}`}
                aria-pressed={active}
              >
                <span className="font-syne font-semibold text-base block leading-none">{l.level}</span>
                <span className="font-inter text-[9px] uppercase tracking-wider leading-[1.2] hidden sm:block break-words hyphens-auto px-0.5">
                  {l.name.split(" / ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current level panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.level}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="px-6 md:px-8 pt-6 pb-8"
        >
          <p className="section-label text-amber mb-2">Lv {current.level} · {current.name}</p>
          <p className="font-inter text-sm italic text-bone/60 mb-6">
            "{current.oneLiner}"
          </p>

          <p className="section-label text-bone/40 mb-3">What we'd focus on</p>
          <ul className="space-y-2.5 mb-6">
            {current.bullets.map((b, i) => (
              <li key={i} className="font-inter text-sm leading-body text-bone/75 flex gap-3">
                <span className="text-amber shrink-0">→</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="pt-5 border-t border-white/10">
            <p className="font-inter text-sm text-white">
              <span className="text-amber mr-1">→</span> {current.callout}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Calculator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [pLevel, setPLevel] = useState(2);
  const [cLevel, setCLevel] = useState(2);

  return (
    <section id="calculator" className="bg-slate py-20 md:py-28" aria-labelledby="calculator-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label text-amber mb-4">Find your level</p>
          <h2
            id="calculator-heading"
            className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-white mb-6 max-w-3xl leading-tight"
          >
            Where do you actually stand?
          </h2>
          <p className="font-inter text-base md:text-lg leading-body text-bone/60 mb-10 max-w-2xl">
            Two sliders — one for you, one for your company. Pick the level that fits. I'll show you what I'd work on with you next.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <LevelTrack track="personal" levels={PERSONAL_LEVELS} value={pLevel} setValue={setPLevel} />
            <LevelTrack track="company" levels={COMPANY_LEVELS} value={cLevel} setValue={setCLevel} />
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="font-inter text-sm text-bone/60 max-w-xl">
              Want a written assessment and a proposal scoped to where you actually are?
            </p>
            <Link
              href={`/contact?p=${pLevel}&c=${cLevel}`}
              className="font-inter text-sm font-medium bg-amber text-white px-6 py-3 hover:bg-[#C06A1F] transition-colors duration-200 shrink-0"
            >
              Send me your levels →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
