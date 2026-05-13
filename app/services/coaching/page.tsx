import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";

export const metadata = {
  title: "AI Operator — 1:1 coaching | Fieldwork AI",
  description: "1:1 AI coaching for founders, executives, and operators. Become the person on your team everyone goes to with the AI question.",
};

export default function CoachingPage() {
  return (
    <main>
      <Nav />
      <PageHero
        eyebrow="AI Operator — 1:1 coaching"
        title="Become the person on your team everyone goes to with the AI question."
        subhead="A 1:1 engagement. We build your personal AI operating system together — your context, your prompts, your workflows. You leave with fluency you didn't have, and artifacts that compound."
      />

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="section-label text-amber mb-3">Who this is for</p>
            <p className="font-inter text-base leading-body text-steel">
              You're a founder, executive, or senior operator. You see what AI is doing and don't want to fall behind. You've tried ChatGPT and felt the gap between "I used it once" and "I have it baked into how I think." You want a guide, not a course.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="section-label text-amber mb-3">The Method, applied 1:1</p>
            <p className="font-inter text-sm leading-body text-steel mb-5 italic">
              One method across every engagement. In 1:1 coaching, you sit in the driver's seat the whole way.
            </p>
            <div className="space-y-5">
              <div>
                <p className="font-syne font-semibold text-lg text-slate mb-1">Week 1 — Frame &amp; Coach</p>
                <p className="font-inter text-sm leading-body text-steel">I learn your business, your style, your goals. We write an opinionated thesis on where AI moves the needle in your work — and rebuild 2–3 recurring workflows in front of you. You learn the frameworks while we write them.</p>
              </div>
              <div>
                <p className="font-syne font-semibold text-lg text-slate mb-1">Weeks 2–3 — Build &amp; Teach</p>
                <p className="font-inter text-sm leading-body text-steel">Real code, real prompts, real configs. Identity doc, decision frameworks, project structures, key-people CRM — the same architecture I run my own life on, customized to yours. You learn the tools while we ship.</p>
              </div>
              <div>
                <p className="font-syne font-semibold text-lg text-slate mb-1">Week 4 — Read the Signal</p>
                <p className="font-inter text-sm leading-body text-steel">We test what we built on your live work — memos, decisions, hiring, board prep. You learn to tell AI signal from noise on your own work, not someone else's case study.</p>
              </div>
              <div>
                <p className="font-syne font-semibold text-lg text-slate mb-1">Week 5+ — Scale or Kill</p>
                <p className="font-inter text-sm leading-body text-steel">What's working scales — into more of your week, into your team. What isn't, we kill. By now you can make the next AI call without me in the room. That's the point.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="section-label text-amber mb-4">What you get</p>
            <ul className="space-y-3 font-inter text-base leading-body text-bone/70">
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Weekly 60–90 minute working session</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Async access between sessions (Signal, weekday hours)</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Your personal AI OS — yours forever, portable, forkable</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> A decision log of every recommendation and rationale</li>
              <li className="flex gap-3"><span className="text-amber shrink-0">→</span> Office hours during onboarding</li>
            </ul>
          </div>
          <div>
            <p className="section-label text-amber mb-4">Pricing</p>
            <div className="space-y-5 font-inter text-base text-bone/70">
              <div className="border-b border-white/10 pb-4">
                <p className="font-syne font-semibold text-white text-lg mb-1">Intensive (first 4 weeks)</p>
                <p className="text-amber font-syne font-semibold text-2xl">$3,500/month</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <p className="font-syne font-semibold text-white text-lg mb-1">Ongoing (monthly)</p>
                <p className="text-amber font-syne font-semibold text-2xl">$1,500–$2,500/month</p>
                <p className="text-sm text-bone/50 mt-1">Cadence-dependent</p>
              </div>
              <div>
                <p className="font-syne font-semibold text-white text-lg mb-1">Standalone setup</p>
                <p className="text-amber font-syne font-semibold text-2xl">$5,000 fixed</p>
                <p className="text-sm text-bone/50 mt-1">Two weeks. Leaves you with a working personal OS and weekly habits.</p>
              </div>
            </div>
            <p className="font-inter text-xs italic text-bone/40 mt-6 border-l-2 border-amber/40 pl-4">
              All artifacts are yours to keep. Cancel any time. No retainer trap.
            </p>
          </div>
        </div>
      </section>

      <CTABand
        heading="Want a coaching intro?"
        body="A 30-minute call. No pitch. We'll find your highest-leverage workflow and you'll know if we're a fit by the end."
        ctaLabel="Book an intro"
      />
      <Footer />
    </main>
  );
}
