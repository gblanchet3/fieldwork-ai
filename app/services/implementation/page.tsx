import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { METHODOLOGY_PHASES } from "@/lib/constants";

export const metadata = {
  title: "Thesis Sprint + Build | Fieldwork AI",
  description: "Find the AI bet worth making. Build the thing that makes it. Or hand you the plan and let your team ship it.",
};

export default function ImplementationPage() {
  return (
    <main>
      <Nav />
      <PageHero
        eyebrow="Implementation"
        title="Find the bet worth making. Build the thing that makes it. Or hand you the plan."
        subhead="Most AI consulting jumps straight to 'let's build a chatbot.' I don't. The biggest leverage usually shows up two questions earlier — what should we be building, and have we proven it works?"
      />

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">The method</p>
          <h2 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-slate mb-12 max-w-3xl leading-tight">
            Thesis → Prototype → Validate → Scale.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {METHODOLOGY_PHASES.map((phase) => (
              <div key={phase.number} className="border border-dust bg-white p-8">
                <p className="font-syne font-semibold text-4xl text-amber mb-3 leading-none">{phase.number}</p>
                <h3 className="font-syne font-semibold text-xl text-slate mb-3">{phase.title}</h3>
                <p className="font-inter text-sm leading-body text-steel">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">Why this method</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-syne font-semibold text-xl text-white mb-3">Cost of building has collapsed.</h3>
              <p className="font-inter text-sm leading-body text-bone/60">A working AI prototype that took a team a quarter in 2023 takes a builder a week now. So we don't validate before building — we build <em>to</em> validate. Faster, cheaper, more honest.</p>
            </div>
            <div>
              <h3 className="font-syne font-semibold text-xl text-white mb-3">Sovereignty by default.</h3>
              <p className="font-inter text-sm leading-body text-bone/60">Every artifact — code, prompts, library, configs, infra — lives in a repo <em>you</em> own. Vanilla tools (Claude Code, GitHub, your cloud) so you can swap models, harnesses, or vendors as the market evolves.</p>
            </div>
            <div>
              <h3 className="font-syne font-semibold text-xl text-white mb-3">The exit is the offer.</h3>
              <p className="font-inter text-sm leading-body text-bone/60">I don't optimize for retainer expansion. The cleanest engagement is one that ends with you running.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="section-label text-amber mb-4">What you get</p>
            <ul className="space-y-3 font-inter text-base leading-body text-steel">
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Written thesis document, branded with your context</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Working prototype in a repo your team can poke at</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Validation report with quantitative signal where possible</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Scale plan: cost, time, team needs, vendor recommendations, build vs. buy</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Decision log</li>
            </ul>
          </div>
          <div>
            <p className="section-label text-amber mb-4">Pricing</p>
            <div className="space-y-5">
              <div className="border-b border-dust pb-4">
                <p className="font-syne font-semibold text-slate text-lg mb-1">Thesis Sprint</p>
                <p className="text-amber font-syne font-semibold text-2xl">$7,500–$18,000 fixed</p>
                <p className="text-sm text-steel/70 mt-1">Scope set on intro call.</p>
              </div>
              <div className="border-b border-dust pb-4">
                <p className="font-syne font-semibold text-slate text-lg mb-1">Build &amp; Hand-off</p>
                <p className="text-amber font-syne font-semibold text-2xl">Scoped after Sprint</p>
                <p className="text-sm text-steel/70 mt-1">Typical engagements run $25,000–$95,000.</p>
              </div>
              <div>
                <p className="font-syne font-semibold text-slate text-lg mb-1">Plan-only hand-off</p>
                <p className="text-amber font-syne font-semibold text-2xl">$0 additional</p>
                <p className="text-sm text-steel/70 mt-1">Included in Sprint deliverables. Your team builds, I'm available for spot consulting.</p>
              </div>
            </div>
            <p className="font-inter text-xs italic text-steel/60 mt-6 border-l-2 border-amber/40 pl-4">
              All deliverables are yours to keep. I bring the muscle. You keep the artifact.
            </p>
          </div>
        </div>
      </section>

      <CTABand
        heading="Start with a Thesis Sprint."
        body="Two weeks, fixed price, real artifact. By the end you'll know what to build, what to skip, and whether to use me to ship it."
        ctaLabel="Talk about a Sprint"
      />
      <Footer />
    </main>
  );
}
