import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { OPERATOR_HISTORY } from "@/lib/constants";

export const metadata = {
  title: "For SaaS & Software Companies | Fieldwork AI",
  description: "AI strategy and implementation for SaaS teams. From a former Head of Product, CTO, and CEO who's lived the transition.",
};

export default function SaasPage() {
  return (
    <main>
      <Nav />
      <PageHero
        eyebrow="For SaaS & Software Companies"
        title="Your AI roadmap shouldn't be your competitor's roadmap with a logo swap."
        subhead="Most software companies are bolting AI onto existing UIs because everyone else is. The ones that win are the ones rebuilding their core workflows around what AI actually makes possible. I've been Head of Product at a venture-backed legal SaaS through this exact transition."
      />

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">Where I tend to add value</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-dust bg-white p-8">
              <h3 className="font-syne font-semibold text-lg text-slate mb-3">Product strategy & thesis</h3>
              <p className="font-inter text-sm leading-body text-steel">What should you actually build? Where does AI compress the workflow vs. just decorate it? Where does it eat your moat?</p>
            </div>
            <div className="border border-dust bg-white p-8">
              <h3 className="font-syne font-semibold text-lg text-slate mb-3">Internal AI operations</h3>
              <p className="font-inter text-sm leading-body text-steel">Your engineers, designers, PMs, and CSMs all need fluency. The companies whose teams ship AI-augmented work daily move 3x faster than those who don't.</p>
            </div>
            <div className="border border-dust bg-white p-8">
              <h3 className="font-syne font-semibold text-lg text-slate mb-3">Build with the right scaffolding</h3>
              <p className="font-inter text-sm leading-body text-steel">Most "AI features" are SaaS wrappers around someone else's API. We build with sovereignty in mind — your context, your prompts, your evals — so when the model market shifts, you swap engines without rebuilding.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="section-label text-amber mb-4">My background here</p>
            <p className="font-inter text-base leading-body text-bone/70 mb-4">
              I've shipped product at venture scale, run engineering teams, and seen how AI gets adopted — and rejected — inside real software orgs.
            </p>
            <ul className="space-y-3 mt-4">
              {OPERATOR_HISTORY.map((c) => (
                <li key={c.co} className="border-b border-white/10 pb-3 flex justify-between items-baseline gap-4">
                  <div>
                    <p className="font-syne font-semibold text-white">{c.co}</p>
                    <p className="font-inter text-sm text-bone/50">{c.role}</p>
                  </div>
                  {c.note && <p className="font-inter text-xs text-bone/40 text-right shrink-0 max-w-[55%]">{c.note}</p>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label text-amber mb-4">How we'd typically engage</p>
            <ul className="space-y-4 font-inter text-sm leading-body text-bone/70">
              <li className="flex gap-3">
                <span className="text-amber shrink-0">→</span>
                <span><strong className="text-white">Coaching block</strong> for founder/CEO/CPO — 1:1, 30–60 days, $3,500/mo</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber shrink-0">→</span>
                <span><strong className="text-white">Thesis Sprint</strong> for the product or eng team — 2 weeks, $7.5–18K, ends with a written AI strategy + working prototype</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber shrink-0">→</span>
                <span><strong className="text-white">Team Cohort</strong> for product, eng, or CS leadership — 4 weeks, $12.5–30K</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber shrink-0">→</span>
                <span><strong className="text-white">Build & Hand-off</strong> for a specific high-leverage feature — scoped after Sprint</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <CTABand
        heading="Your AI roadmap, not someone else's."
        body="Tell me where your product is, where the team is, and where you want to be in two quarters. We'll find the right starting move."
        ctaLabel="Talk about your roadmap"
      />
      <Footer />
    </main>
  );
}
