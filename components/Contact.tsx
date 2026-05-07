"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { CONTACT_EMAIL } from "@/lib/constants";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const inputClass =
  "w-full bg-white/5 border border-white/15 text-white font-inter text-sm px-4 py-3 placeholder:text-white/30 focus:outline-none focus:border-amber transition-colors duration-200";
const selectClass =
  "w-full bg-white/5 border border-white/15 text-white font-inter text-sm px-4 py-3 focus:outline-none focus:border-amber transition-colors duration-200 appearance-none cursor-pointer";

function ContactInner({ standalone = false }: { standalone?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const params = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    iAm: "",
    engagement: "",
    message: "",
    pLevel: "",
    cLevel: "",
  });

  useEffect(() => {
    const p = params?.get("p");
    const c = params?.get("c");
    setForm((prev) => ({
      ...prev,
      pLevel: p ?? prev.pLevel,
      cLevel: c ?? prev.cLevel,
    }));
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Fieldwork AI — let's talk");
    const levelLine = form.pLevel || form.cLevel
      ? `\nLevels: Personal Lv ${form.pLevel || "—"}, Company Lv ${form.cLevel || "—"}`
      : "";
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nI'm a: ${form.iAm}\nLooking at: ${form.engagement}${levelLine}\n\nWhat I'm trying to do:\n${form.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      className={`${standalone ? "bg-slate pt-32 pb-24 md:pt-40 md:pb-32" : "bg-olive py-24 md:py-32"}`}
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-start"
        >
          <div>
            <motion.p variants={itemVariants} className="section-label text-amber mb-4">Talk to me</motion.p>
            <motion.h2
              id="contact-heading"
              variants={itemVariants}
              className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-white mb-8 leading-tight"
            >
              Two ways in.
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-6 mb-10">
              <div>
                <p className="font-syne font-semibold text-lg text-white mb-2">1. Run the calculator.</p>
                <p className="font-inter text-base leading-body text-bone/60">
                  Find your level, send me your bullets. I'll come back with a written assessment and a proposal scoped to where you actually are. No template, no slides.
                </p>
              </div>
              <div>
                <p className="font-syne font-semibold text-lg text-white mb-2">2. Just book a 30-minute call.</p>
                <p className="font-inter text-base leading-body text-bone/60">
                  No pitch deck. We'll find your biggest leverage in one conversation. If we're a fit, we'll talk about how to start. If we're not, I'll point you to someone who is.
                </p>
              </div>
            </motion.div>

            <motion.p variants={itemVariants} className="font-inter text-sm text-bone/40">
              Or email me directly:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-amber hover:text-white transition-colors duration-200 underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </motion.p>
          </div>

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="section-label text-bone/40 block mb-2">Name</label>
              <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className="section-label text-bone/40 block mb-2">Email</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" className={inputClass} />
            </div>
            <div className="relative">
              <label htmlFor="iAm" className="section-label text-bone/40 block mb-2">I'm a...</label>
              <select id="iAm" name="iAm" required value={form.iAm} onChange={handleChange} className={selectClass}>
                <option value="" disabled className="bg-olive">Select one</option>
                <option value="Founder/Executive" className="bg-olive">Founder / Executive</option>
                <option value="SaaS team" className="bg-olive">SaaS / software team</option>
                <option value="Service business" className="bg-olive">Service business</option>
                <option value="Investment firm" className="bg-olive">Investment firm</option>
                <option value="Other" className="bg-olive">Other</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-[calc(50%+8px)] -translate-y-1/2" aria-hidden="true">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="rgba(240,235,225,0.4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
            </div>
            <div className="relative">
              <label htmlFor="engagement" className="section-label text-bone/40 block mb-2">What I'm exploring</label>
              <select id="engagement" name="engagement" value={form.engagement} onChange={handleChange} className={selectClass}>
                <option value="" disabled className="bg-olive">Select one</option>
                <option value="Coaching (AI Operator)" className="bg-olive">AI Operator coaching</option>
                <option value="Thesis Sprint" className="bg-olive">Thesis Sprint</option>
                <option value="Build & Hand-off" className="bg-olive">Build & Hand-off</option>
                <option value="Team Cohort" className="bg-olive">Team Cohort</option>
                <option value="Not sure yet" className="bg-olive">Not sure yet</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-[calc(50%+8px)] -translate-y-1/2" aria-hidden="true">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="rgba(240,235,225,0.4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
            </div>
            <div>
              <label htmlFor="message" className="section-label text-bone/40 block mb-2">
                One sentence about what you're trying to do
              </label>
              <textarea id="message" name="message" rows={3} value={form.message} onChange={handleChange} placeholder="A sentence is plenty." className={`${inputClass} resize-none`} />
            </div>
            {(form.pLevel || form.cLevel) && (
              <div className="border border-amber/30 bg-amber/5 px-4 py-3">
                <p className="font-inter text-xs text-bone/70">
                  From the calculator: <span className="text-amber font-medium">Personal Lv {form.pLevel || "—"} · Company Lv {form.cLevel || "—"}</span>
                </p>
              </div>
            )}
            <button
              type="submit"
              className="w-full font-inter text-sm font-medium bg-amber text-white py-4 hover:bg-[#C06A1F] transition-colors duration-200 mt-2"
            >
              Send →
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}

export default function Contact({ standalone = false }: { standalone?: boolean }) {
  return (
    <Suspense fallback={<div className={standalone ? "bg-slate min-h-screen" : "bg-olive py-24"} />}>
      <ContactInner standalone={standalone} />
    </Suspense>
  );
}
