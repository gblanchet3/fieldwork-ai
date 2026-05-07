import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";

export const metadata = {
  title: "Team Cohort — AI enablement | Fieldwork AI",
  description: "A 4-week, hands-on AI cohort for deal teams, leadership groups, and ops teams. Every member ships their own AI artifact.",
};

export default function EnablementPage() {
  return (
    <main>
      <Nav />
      <PageHero
        eyebrow="Team Enablement"
        title="Train your team to build their own AI artifacts. Not consume someone else's."
        subhead="A 4-week, hands-on cohort. Every team member leaves with a working AI artifact built for their own job — not a watched video, not a certificate, a thing they made."
      />

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">Who this is for</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-dust bg-white p-8">
              <h3 className="font-syne font-semibold text-lg text-slate mb-2">PE / VC firms</h3>
              <p className="font-inter text-sm leading-body text-steel">Deal teams that want AI as a sourcing and diligence advantage.</p>
            </div>
            <div className="border border-dust bg-white p-8">
              <h3 className="font-syne font-semibold text-lg text-slate mb-2">Leadership teams</h3>
              <p className="font-inter text-sm leading-body text-steel">Execs who want shared fluency before pushing AI down through the org.</p>
            </div>
            <div className="border border-dust bg-white p-8">
              <h3 className="font-syne font-semibold text-lg text-slate mb-2">Ops teams</h3>
              <p className="font-inter text-sm leading-body text-steel">Operators who need the muscle to ship internal automations themselves.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">What happens</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Foundations", body: "What AI actually is in 2026. How to talk to models. Personal context. Everyone leaves with their first custom prompt system." },
              { num: "02", title: "Workflow rebuild", body: "Each participant picks a real recurring task from their own job. We rebuild it together, live." },
              { num: "03", title: "Build & ship", body: "Each participant ships an artifact — a memo generator, sourcing helper, diligence summarizer. Working code, deployed." },
              { num: "04", title: "Compound & own", body: "How to keep going. Share artifacts across the team. Evaluate vendors. Your team's own AI playbook, written together, yours forever." },
            ].map((w) => (
              <div key={w.num}>
                <p className="font-syne font-semibold text-4xl text-amber mb-3 leading-none">{w.num}</p>
                <div className="w-10 h-0.5 bg-amber/30 mb-4" />
                <h3 className="font-syne font-semibold text-lg text-white mb-2">{w.title}</h3>
                <p className="font-inter text-sm leading-body text-bone/60">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="section-label text-amber mb-4">What you get</p>
            <ul className="space-y-3 font-inter text-base leading-body text-steel">
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> 4 weekly 90-minute live sessions (recorded)</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Async support channel between sessions</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Each participant: their own AI artifact, in a repo they own</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Team playbook — shared standards, prompts, tooling</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Optional follow-up coaching block at preferred rate</li>
            </ul>
          </div>
          <div>
            <p className="section-label text-amber mb-4">Pricing</p>
            <div className="space-y-5">
              <div className="border-b border-dust pb-4">
                <p className="font-syne font-semibold text-slate text-lg mb-1">4–8 person cohort</p>
                <p className="text-amber font-syne font-semibold text-2xl">$12,500</p>
              </div>
              <div className="border-b border-dust pb-4">
                <p className="font-syne font-semibold text-slate text-lg mb-1">8–16 person cohort</p>
                <p className="text-amber font-syne font-semibold text-2xl">$22,000</p>
              </div>
              <div>
                <p className="font-syne font-semibold text-slate text-lg mb-1">Full deal team / leadership</p>
                <p className="text-amber font-syne font-semibold text-2xl">$30,000+</p>
                <p className="text-sm text-steel/70 mt-1">Custom scope.</p>
              </div>
            </div>
            <p className="font-inter text-xs italic text-steel/60 mt-6 border-l-2 border-amber/40 pl-4">
              Includes all materials, recordings, and team artifacts. Yours to keep and reuse.
            </p>
          </div>
        </div>
      </section>

      <CTABand
        heading="Train the team that has to make this work."
        body="Tell me about your team and what AI fluency would mean for the next quarter. We'll scope a cohort that fits."
        ctaLabel="Talk about a cohort"
      />
      <Footer />
    </main>
  );
}
