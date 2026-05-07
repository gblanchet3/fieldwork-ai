import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";

export const metadata = {
  title: "For Investment Firms | Fieldwork AI",
  description: "AI fluency for the deal team. AI uplift for the portfolio. Sovereign artifacts the company keeps after exit.",
};

export default function InvestmentPage() {
  return (
    <main>
      <Nav />
      <PageHero
        eyebrow="For PE, VC & Investment Firms"
        title="AI fluency for the deal team. AI uplift for the portfolio."
        subhead="Investment firms have two AI problems: making the deal team faster, and getting portfolio companies adopted without a $60K/year SaaS bill per company. I work on both."
      />

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="section-label text-amber mb-4">For deal teams</p>
            <ul className="space-y-3 font-inter text-sm leading-body text-steel">
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> <span><strong className="text-slate">Sourcing</strong> — AI-augmented research, target lists, market maps. Cuts hours off the weekly motion.</span></li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> <span><strong className="text-slate">Diligence</strong> — memo drafting, document review, market sizing, expert-call prep.</span></li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> <span><strong className="text-slate">IC prep</strong> — automated brief generation in your fund's voice and template.</span></li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> <span><strong className="text-slate">Personal coaching</strong> for partners and principals — same pattern as founders/execs.</span></li>
            </ul>
          </div>
          <div>
            <p className="section-label text-amber mb-4">For portfolio companies</p>
            <ul className="space-y-3 font-inter text-sm leading-body text-steel">
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> <span><strong className="text-slate">Drop-in coaching</strong> for portfolio CEOs — 30–60 day blocks, $3,500/mo.</span></li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> <span><strong className="text-slate">Thesis Sprints</strong> for portfolio cos figuring out where AI applies.</span></li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> <span><strong className="text-slate">Implementation builds</strong> for portfolio cos that need execution muscle.</span></li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> <span><strong className="text-slate">Team cohorts</strong> for ops teams or leadership groups inside portcos.</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">Why this works for funds</p>
          <div className="space-y-6">
            <div>
              <p className="font-syne font-semibold text-xl text-white mb-2">Block-hours pricing</p>
              <p className="font-inter text-base leading-body text-bone/70">Predictable, recurring engagements for repeated portfolio support — billable to fund or LP-friendly.</p>
            </div>
            <div>
              <p className="font-syne font-semibold text-xl text-white mb-2">No vendor lock-in</p>
              <p className="font-inter text-base leading-body text-bone/70">Sovereignty is the default. Every artifact lives in a repo the company owns. When the company exits, your AI investment doesn't walk away with a vendor.</p>
            </div>
            <div>
              <p className="font-syne font-semibold text-xl text-white mb-2">One operator, multiple portcos</p>
              <p className="font-inter text-base leading-body text-bone/70">Consistent quality, consistent playbook, consistent voice across your portfolio. Not a marketplace of strangers.</p>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        heading="Let's map your fund and your portfolio."
        body="A 30-minute call. We'll cover your deal team's current AI use, your portfolio's appetite, and 2–3 candidate engagements."
        ctaLabel="Book a call"
      />
      <Footer />
    </main>
  );
}
