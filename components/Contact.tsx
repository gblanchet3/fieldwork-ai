"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CONTACT_EMAIL } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const inputClass =
  "w-full bg-white/5 border border-white/15 text-white font-inter text-sm px-4 py-3 placeholder:text-white/30 focus:outline-none focus:border-amber transition-colors duration-200";

const selectClass =
  "w-full bg-white/5 border border-white/15 text-white font-inter text-sm px-4 py-3 focus:outline-none focus:border-amber transition-colors duration-200 appearance-none cursor-pointer";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const [form, setForm] = useState({
    name: "",
    businessType: "",
    revenue: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Fieldwork AI — Diagnostic Call Request");
    const body = encodeURIComponent(
      `Name: ${form.name}\nBusiness type: ${form.businessType}\nAnnual revenue: ${form.revenue}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="bg-olive py-24 md:py-32" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-start"
        >
          {/* Left column */}
          <div>
            <motion.p variants={itemVariants} className="section-label text-amber mb-4">
              Get started
            </motion.p>

            <motion.h2
              id="contact-heading"
              variants={itemVariants}
              className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-white mb-6 leading-tight"
            >
              Ready to see what your business is actually worth?
            </motion.h2>

            <motion.p variants={itemVariants} className="font-inter text-base leading-body text-bone/60 mb-8">
              Book a free 30-minute diagnostic call. We'll map your biggest margin leak and key-person risk in one conversation.
            </motion.p>

            <motion.p variants={itemVariants} className="font-inter text-sm text-bone/40">
              Or email us directly:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-amber hover:text-white transition-colors duration-200 underline underline-offset-4"
                aria-label={`Email Fieldwork AI at ${CONTACT_EMAIL}`}
              >
                {CONTACT_EMAIL}
              </a>
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
            aria-label="Contact form — book a diagnostic call"
          >
            {/* Name */}
            <div>
              <label htmlFor="name" className="section-label text-bone/40 block mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputClass}
                aria-required="true"
              />
            </div>

            {/* Business type */}
            <div className="relative">
              <label htmlFor="businessType" className="section-label text-bone/40 block mb-2">
                Business type
              </label>
              <select
                id="businessType"
                name="businessType"
                required
                value={form.businessType}
                onChange={handleChange}
                className={selectClass}
                aria-required="true"
              >
                <option value="" disabled className="bg-olive">
                  Select your industry
                </option>
                <option value="Construction" className="bg-olive">Construction</option>
                <option value="Legal" className="bg-olive">Legal</option>
                <option value="Home Services" className="bg-olive">Home Services</option>
                <option value="Professional Services" className="bg-olive">Professional Services</option>
                <option value="Other" className="bg-olive">Other</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-[calc(50%+8px)] -translate-y-1/2" aria-hidden="true">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="rgba(240,235,225,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Annual revenue */}
            <div className="relative">
              <label htmlFor="revenue" className="section-label text-bone/40 block mb-2">
                Annual revenue
              </label>
              <select
                id="revenue"
                name="revenue"
                required
                value={form.revenue}
                onChange={handleChange}
                className={selectClass}
                aria-required="true"
              >
                <option value="" disabled className="bg-olive">
                  Select revenue range
                </option>
                <option value="$500K–$1M" className="bg-olive">$500K–$1M</option>
                <option value="$1M–$3M" className="bg-olive">$1M–$3M</option>
                <option value="$3M–$8M" className="bg-olive">$3M–$8M</option>
                <option value="$8M–$15M" className="bg-olive">$8M–$15M</option>
                <option value="$15M+" className="bg-olive">$15M+</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-[calc(50%+8px)] -translate-y-1/2" aria-hidden="true">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="rgba(240,235,225,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="section-label text-bone/40 block mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className={inputClass}
                aria-required="true"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="section-label text-bone/40 block mb-2">
                Message{" "}
                <span className="text-white/20 normal-case tracking-normal font-normal" aria-label="optional">
                  (optional)
                </span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your business..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full font-inter text-sm font-medium bg-amber text-white py-4 hover:bg-[#C06A1F] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber mt-2"
              aria-label="Book the call — submit contact form"
            >
              Book the call
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
