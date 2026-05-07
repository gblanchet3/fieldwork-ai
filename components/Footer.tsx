import Link from "next/link";
import { SUBSTACK_URL, CONTACT_EMAIL } from "@/lib/constants";

const FOOTER_NAV = [
  { label: "Services", href: "/services/coaching" },
  { label: "Customers", href: "/customers/founders" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-slate border-t border-white/10 py-16 md:py-20" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          <div className="md:col-span-2">
            <p className="font-syne font-semibold text-xl text-white mb-2">
              Fieldwork<span className="text-amber">.</span>AI
            </p>
            <p className="font-inter text-sm text-bone/40 mb-3 max-w-md">
              Personalized AI coaching &amp; implementation. Sovereignty over subscriptions. Hand-holding over hype.
            </p>
            <p className="font-inter text-sm text-bone/40">
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-amber transition-colors">{CONTACT_EMAIL}</a>
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-inter text-sm text-bone/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={SUBSTACK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-sm text-bone/50 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Field Notes
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-inter text-xs text-bone/30">
            &copy; 2026 Fieldwork AI · Boise, Idaho
          </p>
          <p className="font-inter text-xs text-bone/30 italic">
            All artifacts owned by their respective clients.
          </p>
        </div>
      </div>
    </footer>
  );
}
