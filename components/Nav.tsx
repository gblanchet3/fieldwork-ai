"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, SERVICES_DROPDOWN, CUSTOMERS_DROPDOWN } from "@/lib/constants";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<null | "services" | "customers">(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{ backgroundColor: scrolled ? "rgba(15,25,35,0.92)" : "transparent", backdropFilter: scrolled ? "blur(8px)" : "none" }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-syne font-semibold text-xl tracking-tight text-white"
            aria-label="Fieldwork AI home"
            onClick={closeAll}
          >
            Fieldwork<span className="text-amber">.</span>AI
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("services")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href="/services/coaching"
                className="font-inter text-sm text-bone/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              >
                Services
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Link>
              <AnimatePresence>
                {openDropdown === "services" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-3 w-72"
                  >
                    <div className="bg-slate border border-white/10 shadow-xl">
                      {SERVICES_DROPDOWN.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                          onClick={closeAll}
                        >
                          <p className="font-syne font-semibold text-sm text-white mb-0.5">{item.label}</p>
                          <p className="font-inter text-xs text-bone/40">{item.sub}</p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Customers dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("customers")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href="/customers/founders"
                className="font-inter text-sm text-bone/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              >
                Customers
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Link>
              <AnimatePresence>
                {openDropdown === "customers" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-3 w-64"
                  >
                    <div className="bg-slate border border-white/10 shadow-xl">
                      {CUSTOMERS_DROPDOWN.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-5 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 font-inter text-sm text-bone/80 hover:text-white"
                          onClick={closeAll}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/work" className="font-inter text-sm text-bone/70 hover:text-white transition-colors">Work</Link>
            <Link href="/about" className="font-inter text-sm text-bone/70 hover:text-white transition-colors">About</Link>
            <a
              href="https://gabeblanchet.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-sm text-bone/70 hover:text-white transition-colors flex items-center gap-1"
            >
              Field Notes
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="font-inter text-sm font-medium bg-amber text-white px-5 py-2.5 hover:bg-[#C06A1F] transition-colors duration-200"
            >
              Talk to me
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-16 left-0 right-0 z-40 bg-olive border-t border-white/10 md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col px-6 py-6 gap-2" aria-label="Mobile navigation">
              <p className="section-label text-bone/40 mt-2 mb-1">Services</p>
              {SERVICES_DROPDOWN.map((item) => (
                <Link key={item.href} href={item.href} className="font-inter text-base text-bone/80 py-2" onClick={closeAll}>
                  {item.label} <span className="text-bone/40 text-sm">— {item.sub}</span>
                </Link>
              ))}
              <p className="section-label text-bone/40 mt-4 mb-1">Customers</p>
              {CUSTOMERS_DROPDOWN.map((item) => (
                <Link key={item.href} href={item.href} className="font-inter text-base text-bone/80 py-2" onClick={closeAll}>
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-4 pt-4 flex flex-col gap-3">
                <Link href="/work" className="font-inter text-base text-bone/80" onClick={closeAll}>Work</Link>
                <Link href="/about" className="font-inter text-base text-bone/80" onClick={closeAll}>About</Link>
                <a href="https://gabeblanchet.substack.com/" target="_blank" rel="noopener noreferrer" className="font-inter text-base text-bone/80">Field Notes ↗</a>
                <Link href="/contact" className="font-inter text-sm font-medium bg-amber text-white px-5 py-3 text-center mt-2" onClick={closeAll}>
                  Talk to me
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
