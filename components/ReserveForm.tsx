"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/constants";

// Reservation submissions are relayed by FormSubmit (https://formsubmit.co) to
// Gabe's inbox via this hashed alias — a no-account form-to-email relay that
// works on a static GitHub Pages site. Using the alias (not the naked email)
// keeps the destination address out of the page source.
const FORMSUBMIT_ENDPOINT = "388796ba2c451c3cb3ae55e861b5e7fd";

const inputClass =
  "w-full bg-white/5 border border-white/15 text-white font-inter text-sm px-4 py-3 placeholder:text-white/30 focus:outline-none focus:border-amber transition-colors duration-200";
const selectClass =
  "w-full bg-white/5 border border-white/15 text-white font-inter text-sm px-4 py-3 focus:outline-none focus:border-amber transition-colors duration-200 appearance-none cursor-pointer";
const labelClass = "section-label text-bone/40 block mb-2";

const Chevron = () => (
  <div className="pointer-events-none absolute right-4 top-[calc(50%+8px)] -translate-y-1/2" aria-hidden="true">
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" className="text-bone/40" />
    </svg>
  </div>
);

type Status = "idle" | "submitting" | "success" | "error";

export default function ReserveForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    seats: "Just me — 1 seat ($1,000)",
    session: "July 30 — first open cohort",
    goal: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New seat reservation — ${form.name}, ${form.company}`,
          _template: "table",
          _captcha: "false",
          Name: form.name,
          Email: form.email,
          Company: form.company,
          Role: form.role,
          Phone: form.phone,
          Seats: form.seats,
          Session: form.session,
          "What they want to walk out with": form.goal,
        }),
      });
      const data = await res.json().catch(() => ({}));
      // FormSubmit returns success as the string "true" on a real send. Anything
      // else (e.g. the one-time "activate your form" response) is not a delivery.
      if (!res.ok || String(data.success) !== "true") throw new Error("not delivered");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-slate p-8 md:p-10 border border-amber/30">
        <p className="section-label text-amber mb-3">You&rsquo;re on the list</p>
        <h3 className="font-syne font-semibold text-2xl md:text-3xl text-white mb-4 leading-tight">
          Seat held for {form.session.includes("July 30") ? "July 30" : "a future date"}.
        </h3>
        <p className="font-inter text-base leading-body text-bone/70 mb-2">
          I&rsquo;ll email you within a day to confirm your seat, send the exact Boise
          location, and sort out the (refundable) details. Nothing&rsquo;s due now.
        </p>
        <p className="font-inter text-sm text-bone/50">
          Didn&rsquo;t mean to reserve? Just reply to that email and I&rsquo;ll release the seat.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate p-7 md:p-9" noValidate>
      {/* honeypot — bots fill this, humans never see it */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>Company</label>
          <input id="company" name="company" type="text" required value={form.company} onChange={handleChange} placeholder="Company name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>Your role</label>
          <input id="role" name="role" type="text" value={form.role} onChange={handleChange} placeholder="Owner, CEO, ops lead…" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
        <div className="relative">
          <label htmlFor="seats" className={labelClass}>How many seats</label>
          <select id="seats" name="seats" value={form.seats} onChange={handleChange} className={selectClass}>
            <option className="bg-slate">Just me — 1 seat ($1,000)</option>
            <option className="bg-slate">Me + my right hand — 2 seats (50% off the 2nd)</option>
          </select>
          <Chevron />
        </div>
        <div className="relative">
          <label htmlFor="session" className={labelClass}>Which session</label>
          <select id="session" name="session" value={form.session} onChange={handleChange} className={selectClass}>
            <option className="bg-slate">July 30 — first open cohort</option>
            <option className="bg-slate">A future date — notify me</option>
          </select>
          <Chevron />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="phone" className={labelClass}>Phone <span className="text-bone/25 normal-case tracking-normal">(optional)</span></label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="So I can confirm fast" className={inputClass} />
      </div>

      <div className="mt-5">
        <label htmlFor="goal" className={labelClass}>One thing you&rsquo;d love to walk out with <span className="text-bone/25 normal-case tracking-normal">(optional)</span></label>
        <textarea id="goal" name="goal" rows={3} value={form.goal} onChange={handleChange} placeholder="A workflow that eats your time, a decision you keep chewing on…" className={`${inputClass} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 w-full font-inter text-sm font-medium bg-amber text-white px-8 py-4 hover:bg-[#C06A1F] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Holding your seat…" : "Reserve my seat →"}
      </button>

      {status === "error" && (
        <p className="mt-4 font-inter text-sm text-amber">
          Something hiccuped on our end. Email me directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}?subject=Seat%20reservation%20—%20AI%20for%20Business%20Leaders`} className="underline underline-offset-4 hover:text-white">
            {CONTACT_EMAIL}
          </a>{" "}
          and I&rsquo;ll lock it in.
        </p>
      )}

      <p className="mt-4 font-inter text-xs text-bone/40">
        No payment due now. Refundable if you don&rsquo;t walk out with something you&rsquo;ll use.
      </p>
    </form>
  );
}
