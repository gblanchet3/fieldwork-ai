import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";

export const metadata = {
  title: "For Founders & Executives | Fieldwork AI",
  description: "Personalized AI coaching for founders, executives, and operators. The fastest way to stop falling behind.",
};

export default function FoundersPage() {
  return (
    <main>
      <Nav />
      <PageHero
        eyebrow="For Founders & Executives"
        title="The fastest way to stop falling behind."
        subhead="You're running a company, a fund, or a team. You don't have time to take a course. You also don't have time to not know this stuff. I sit with you, on your real work, and make you fluent in the thing that's about to define the next decade."
      />

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="section-label text-amber mb-4">Who I work with</p>
            <p className="font-inter text-base leading-body text-steel mb-4">
              Leaders of <strong>$5M–$50M revenue companies</strong> — founders, CEOs, or empowered execs — who want AI in their own thinking, not delegated to a junior. Bought in, or curious enough to fund a real bet. Not "we banned ChatGPT" shops.
            </p>
            <p className="font-inter text-base leading-body text-steel mb-4">
              You've tried ChatGPT. Maybe you have a paid Claude subscription. You know smart people who post about it constantly. But your <em>own</em> day still looks the same as it did 18 months ago. Same email, same memos, same hiring loops, same decisions.
            </p>
            <p className="font-inter text-base leading-body text-steel">
              The gap isn't access. It's reps with a guide.
            </p>
          </div>
          <div>
            <p className="section-label text-amber mb-4">How working with me looks</p>
            <div className="space-y-4">
              <div>
                <p className="font-syne font-semibold text-slate mb-1">Discovery week.</p>
                <p className="font-inter text-sm leading-body text-steel">I learn your business, your week, your style. We pick the workflows where AI would actually move you.</p>
              </div>
              <div>
                <p className="font-syne font-semibold text-slate mb-1">Working sessions.</p>
                <p className="font-inter text-sm leading-body text-steel">Weekly. We work on whatever's live — board prep, hiring, fundraising, strategy, market research. AI is in front of us the whole time.</p>
              </div>
              <div>
                <p className="font-syne font-semibold text-slate mb-1">Your own OS.</p>
                <p className="font-inter text-sm leading-body text-steel">By month two you have a personal operating system — file-structured identity, decision frameworks, CRM, project tracking, voice tuning — that runs in vanilla AI tools. Portable. Yours. Forkable.</p>
              </div>
              <div>
                <p className="font-syne font-semibold text-slate mb-1">The exit.</p>
                <p className="font-inter text-sm leading-body text-steel">You don't need me forever. We dial down to monthly, then quarterly, then "text me when something's weird."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">What changes</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Memos that read like you, drafted in 20 minutes",
              "Hiring loops with AI-assisted candidate prep and reference work",
              "Board materials drafted from raw data, in your voice",
              "Recurring decisions codified so you stop relitigating",
              "A weekly digest that surfaces what you'd otherwise miss",
              "A personal CRM that ranks who to reach out to and when",
            ].map((c) => (
              <div key={c} className="border border-white/10 p-6">
                <p className="font-inter text-base leading-body text-bone/70"><span className="text-amber mr-2">→</span>{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-3">Pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-dust bg-white p-6">
              <p className="font-syne font-semibold text-slate text-lg mb-1">Intensive month</p>
              <p className="text-amber font-syne font-semibold text-2xl">$3,500</p>
            </div>
            <div className="border border-dust bg-white p-6">
              <p className="font-syne font-semibold text-slate text-lg mb-1">Ongoing</p>
              <p className="text-amber font-syne font-semibold text-2xl">$1,500–$2,500/mo</p>
            </div>
            <div className="border border-dust bg-white p-6">
              <p className="font-syne font-semibold text-slate text-lg mb-1">Standalone setup</p>
              <p className="text-amber font-syne font-semibold text-2xl">$5,000 fixed</p>
              <p className="text-sm text-steel/70 mt-1">2-week build of your personal OS.</p>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        heading="Start with a coaching intro."
        body="A 30-minute call. We'll find your highest-leverage workflow and you'll know if it's a fit."
        ctaLabel="Book an intro"
      />
      <Footer />
    </main>
  );
}
