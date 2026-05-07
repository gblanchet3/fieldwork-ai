import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";

export const metadata = {
  title: "For Service Businesses | Fieldwork AI",
  description: "AI implementation for real estate, construction, professional services, and home services. Build the systems. Keep the systems.",
};

export default function ServicesBizPage() {
  return (
    <main>
      <Nav />
      <PageHero
        eyebrow="For Service Businesses"
        title="The single highest-leverage hire you can make right now isn't a person."
        subhead="Service businesses — real estate, construction, professional services, home services — are sitting on top of the most automatable workflows in the economy. Quoting, scheduling, knowledge capture, client comms, lead gen. I build the systems. You keep them."
      />

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">Where I tend to add value</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-dust bg-white p-8">
              <h3 className="font-syne font-semibold text-lg text-slate mb-3">Knowledge capture before it walks out the door</h3>
              <p className="font-inter text-sm leading-body text-steel">Senior people — admins, project managers, estimators — carry 20 years of context in their heads. When they retire or leave, that context goes with them. We codify it into a system your team can query forever.</p>
            </div>
            <div className="border border-dust bg-white p-8">
              <h3 className="font-syne font-semibold text-lg text-slate mb-3">Sales hubs and account intelligence</h3>
              <p className="font-inter text-sm leading-body text-steel">AI-powered briefs on your top customers, suppliers, prospects — pulled together automatically, updated weekly. The kind of thing your top rep does manually, scaled across the team.</p>
            </div>
            <div className="border border-dust bg-white p-8">
              <h3 className="font-syne font-semibold text-lg text-slate mb-3">Quote / estimate / scope automation</h3>
              <p className="font-inter text-sm leading-body text-steel">Interactive estimators, service-area validation, dynamic pricing logic — the stuff that turns a 2-hour quote process into a 10-minute one.</p>
            </div>
            <div className="border border-dust bg-white p-8">
              <h3 className="font-syne font-semibold text-lg text-slate mb-3">Lead gen and back-office plumbing</h3>
              <p className="font-inter text-sm leading-body text-steel">Funnel tracking, automated follow-ups, Sheets-based ops dashboards. Boring, high-leverage, often the highest-ROI work in the engagement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">My background here</p>
          <p className="font-inter text-base md:text-lg leading-body text-bone/70 mb-5">
            I grew up around general contracting and have spent years working with service businesses. I built <strong className="text-white">Rent A Pool Boise</strong> from a business idea to a fully operational service business in weeks — brand, marketing site, interactive estimator with Google Maps service-area validation, early-bird pricing, GA4 funnel, and a Sheets back-office on Apps Script.
          </p>
          <p className="font-inter text-base md:text-lg leading-body text-bone/70">
            The whole thing runs on tools the owner already understood. That's the pattern: I build the system, <em>they</em> keep running it.
          </p>
        </div>
      </section>

      <section className="bg-bone py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">How we'd typically engage</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-dust bg-white p-6">
              <h3 className="font-syne font-semibold text-slate mb-1">Thesis Sprint</h3>
              <p className="font-inter text-xs text-amber mb-3">2 weeks · $7.5–18K</p>
              <p className="font-inter text-sm leading-body text-steel">Map the highest-leverage automation in your business, prototype it, prove it works.</p>
            </div>
            <div className="border border-dust bg-white p-6">
              <h3 className="font-syne font-semibold text-slate mb-1">Build & Hand-off</h3>
              <p className="font-inter text-xs text-amber mb-3">Scoped after Sprint · typical $25–60K</p>
              <p className="font-inter text-sm leading-body text-steel">Build the system end-to-end, deploy it, train your team, hand it over.</p>
            </div>
            <div className="border border-dust bg-white p-6">
              <h3 className="font-syne font-semibold text-slate mb-1">Owner coaching</h3>
              <p className="font-inter text-xs text-amber mb-3">$1.5–3.5K/mo</p>
              <p className="font-inter text-sm leading-body text-steel">For owners who want personal AI fluency to keep building after I'm done.</p>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        heading="Build the system. Keep the system."
        body="Tell me what's manual in your business that shouldn't be. We'll find the highest-leverage starting point."
        ctaLabel="Start with a Sprint"
      />
      <Footer />
    </main>
  );
}
