import { NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-slate border-t border-white/10 py-16 md:py-20" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            {/* TODO: Replace with <Image src="/logo.svg" alt="Fieldwork AI" width={140} height={32} /> when logo is ready */}
            <p className="font-syne font-semibold text-xl text-white mb-2">Fieldwork AI</p>
            <p className="font-inter text-sm text-bone/40">AI systems for service businesses.</p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-inter text-sm text-bone/40 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-inter text-xs text-bone/30">
            &copy; 2026 Fieldwork AI
          </p>
          <p className="font-inter text-xs text-bone/20 italic">
            Built with the same tools we build for our clients.
          </p>
        </div>
      </div>
    </footer>
  );
}
