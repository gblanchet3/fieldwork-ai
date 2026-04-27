"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{ backgroundColor: scrolled ? "#1A3A2A" : "transparent" }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            className="font-syne font-800 text-lg tracking-tight text-white"
            aria-label="Fieldwork AI home"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            {/* TODO: Replace with <Image src="/logo.svg" alt="Fieldwork AI" width={140} height={32} /> when logo is ready */}
            <span className="font-syne font-semibold text-xl text-white">Fieldwork AI</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="font-inter text-sm text-bone/70 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button
              onClick={() => handleNavClick("#contact")}
              className="font-inter text-sm font-medium bg-amber text-white px-5 py-2.5 hover:bg-amber/90 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              aria-label="Talk to us — scroll to contact section"
            >
              Talk to us
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-16 left-0 right-0 z-40 bg-olive border-t border-white/10 md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col px-6 py-6 gap-6" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="font-inter text-base text-bone/80 hover:text-white transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick("#contact")}
                className="font-inter text-sm font-medium bg-amber text-white px-5 py-3 hover:bg-amber/90 transition-colors text-center mt-2"
              >
                Talk to us
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
