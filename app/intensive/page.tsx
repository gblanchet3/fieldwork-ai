import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";

export const metadata = {
  title: "AI for Business Leaders — 1-day intensive | Fieldwork AI",
  description:
    "A small-group, in-person day in Boise for business owners and leaders. Hands on keyboard. Build real AI tools on your own business — and keep everything you make.",
};

const AGENDA = [
  {
    title: "The honest landscape",
    time: "30 min",
    body: "The 10-minute version of what actually matters in AI right now — hype killed, fear killed. Then straight to the keyboards.",
  },
  {
    title: "Build 1 — Your AI thought partner",
    time: "75 min",
    body: "Build a custom assistant grounded in your own business — your context, your voice, your role — and put it to work on a real problem you walked in with.",
  },
  {
    title: "Build 2 — Automate a real workflow",
    time: "90 min",
    body: "Pick a recurring task that eats your week. Build the automation live, end-to-end, until it runs. This is the core of the day.",
  },
  {
    title: "Working lunch + demos",
    time: "45 min",
    body: "Eat, and show the room what you built. Peer ideas, real use cases, momentum. Lunch included.",
  },
  {
    title: "Build 3 — A tool for your team",
    time: "75 min",
    body: "Build something you can hand to staff Monday — a custom assistant, a proposal or report generator, an intake helper.",
  },
  {
    title: "Your 90-day stack + close",
    time: "30 min",
    body: "Lock your tool stack and your first three moves. Where this goes next, and how to take it deeper.",
  },
];

const DELIVERABLES = [
  {
    title: "A custom AI thought partner",
    body: "Trained on your business — your context, your voice, your role — that you'll use the next morning.",
  },
  {
    title: "One real workflow, automated",
    body: "Pick a recurring time-sink from your week — proposals, intake, meeting notes, reporting — and leave with it running.",
  },
  {
    title: "A team-ready tool",
    body: "Something you can hand to your staff Monday: a custom assistant, a document generator, an intake helper.",
  },
  {
    title: "Your 90-day AI stack & plan",
    body: "Exactly what to do next, in what order, and what to stop doing.",
  },
];

const FAQ = [
  {
    q: "Do I need any technical background?",
    a: "No. If you can use email and a web browser, you can do everything here. We handle the setup.",
  },
  {
    q: "What do I need to bring?",
    a: "A laptop, and a few real problems from your business — a workflow that eats your time, documents you work with, a decision you're chewing on. The more real, the more you get out of the day.",
  },
  {
    q: "Is this just ChatGPT?",
    a: "No. ChatGPT is one tool. You'll leave knowing how to pick and combine the right tools for real work — and how to own what you build instead of renting it.",
  },
  {
    q: "What happens after?",
    a: "You get a 1:1 follow-up to pressure-test your plan. If your team wants to go deeper — coaching or hands-on implementation — that's what Fieldwork does. No pressure; the day stands on its own.",
  },
];

export default function IntensivePage() {
  return (
    <main>
      <Nav />
      <PageHero
        eyebrow="One day · In person · Hands on keyboard"
        title={
          <>
            Stop reading about AI.
            <br />
            Spend one day building with it.
          </>
        }
        subhead="A small-group, in-person intensive for business owners and leaders in Boise. No slides you'll forget. No tools you'll never open again. You walk in with the real problems of your business — and walk out having built things that work, on your own data, that you own and keep."
      />

      {/* Event facts band */}
      <section className="bg-olive py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-center">
          <p className="font-inter text-sm text-bone/80"><span className="text-amber font-medium">Thursday, July 30</span> · 9:00am–3:30pm</p>
          <p className="font-inter text-sm text-bone/80">Boise, ID</p>
          <p className="font-inter text-sm text-bone/80">8 seats</p>
          <p className="font-inter text-sm text-bone/80"><span className="text-amber font-medium">$1,000</span> · lunch &amp; follow-up included</p>
        </div>
      </section>

      {/* The problem */}
      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="section-label text-amber mb-3">Why this exists</p>
            <p className="font-syne font-semibold text-2xl text-slate leading-tight">
              You don't have time to be left behind — or to waste a day on theory.
            </p>
          </div>
          <div className="md:col-span-2 space-y-5 font-inter text-base leading-body text-steel">
            <p>
              Everyone says AI is going to reshape your business. You believe them. But your options for actually <em>learning</em> it are terrible.
            </p>
            <p>
              Online courses you'll never finish. Conference keynotes that inspire you for a day and change nothing on Monday. A 22-year-old telling you to "just use ChatGPT" without ever looking at how your business actually runs.
            </p>
            <p>
              So you keep meaning to get to it. And the gap between leaders who <em>operate</em> AI and leaders who <em>talk about</em> it keeps widening.
            </p>
            <p className="text-slate font-medium">
              You don't need another course. You need a day in a room — laptop open, your real work in front of you, someone who builds this for a living sitting beside you. That's this.
            </p>
          </div>
        </div>
      </section>

      {/* What makes it different */}
      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-3">The promise</p>
          <h2 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-white mb-12 leading-tight max-w-3xl">
            You build. All day. On your own business.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <p className="font-syne font-semibold text-lg text-white mb-2">Hands on keyboard — not a lecture.</p>
              <p className="font-inter text-sm leading-body text-bone/60">
                You'll spend the day building, not watching. Every block ends with something running. By 3:30 you've built three things you'll actually use.
              </p>
            </div>
            <div>
              <p className="font-syne font-semibold text-lg text-white mb-2">Your business, your data.</p>
              <p className="font-inter text-sm leading-body text-bone/60">
                No toy examples. You bring a real workflow, real documents, a real bottleneck. We build against that. You leave with assets tuned to your company — not a generic template.
              </p>
            </div>
            <div>
              <p className="font-syne font-semibold text-lg text-white mb-2">You own everything you make.</p>
              <p className="font-inter text-sm leading-body text-bone/60">
                The assistants, the automations, the prompts, the playbook — they're yours. No subscription that holds your work hostage. Portable. Forkable. Yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-3">What you walk out with</p>
          <h2 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-slate mb-12 leading-tight max-w-3xl">
            Three working builds and a plan. Same day.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {DELIVERABLES.map((d) => (
              <div key={d.title} className="flex gap-4 border-t border-slate/10 pt-5">
                <span className="text-amber font-syne font-semibold shrink-0">→</span>
                <div>
                  <p className="font-syne font-semibold text-lg text-slate mb-1">{d.title}</p>
                  <p className="font-inter text-sm leading-body text-steel">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-inter text-sm italic text-steel mt-10 border-l-2 border-amber/40 pl-4 max-w-2xl">
            If you walk out without something you'll actually use, I'll refund the day. No forms. I'm not here to burn your money.
          </p>
        </div>
      </section>

      {/* The day */}
      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-3">The day · ~6 hours</p>
          <h2 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-white mb-12 leading-tight max-w-3xl">
            Build-focused, start to finish.
          </h2>
          <div className="space-y-px">
            {AGENDA.map((block) => (
              <div
                key={block.title}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 py-5 border-b border-white/10"
              >
                <div className="md:col-span-1 font-inter text-xs text-amber pt-1">{block.time}</div>
                <div className="md:col-span-3 font-syne font-semibold text-lg text-white">{block.title}</div>
                <div className="md:col-span-8 font-inter text-sm leading-body text-bone/60">{block.body}</div>
              </div>
            ))}
          </div>
          <p className="font-inter text-sm text-bone/50 mt-8">
            Every person leaves with a free 1:1 follow-up to pressure-test their 90-day plan once they're back in the real world.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="section-label text-amber mb-3">Who it's for</p>
            <p className="font-syne font-semibold text-2xl text-slate leading-tight">
              For leaders who'd rather build than watch.
            </p>
          </div>
          <div className="md:col-span-2 space-y-4 font-inter text-base leading-body text-steel">
            <p><span className="text-slate font-medium">Business owners &amp; CEOs</span> (roughly 10–200 people) who make the call and want leverage now.</p>
            <p><span className="text-slate font-medium">Professional-services leaders</span> — law, accounting, agencies, consulting — where AI ROI is most obvious and immediate.</p>
            <p>Comfortable with a laptop. No technical background required. If you can use email and a browser, you can do everything in this room.</p>
            <p className="text-steel/80 italic pt-2 border-t border-slate/10">
              Not for: people who want a certificate, a recording to watch later, or someone to do it for them while they watch. This is hands-on.
            </p>
          </div>
        </div>
      </section>

      {/* Who leads it */}
      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="section-label text-amber mb-3">Who's in the room</p>
            <p className="font-syne font-semibold text-2xl text-white leading-tight">
              Someone who's built and shipped this — not a reseller.
            </p>
          </div>
          <div className="md:col-span-2 space-y-5 font-inter text-base leading-body text-bone/70">
            <p>
              I'm Gabe Blanchet. MIT mechanical engineer, founder (Grove Labs — raised $6M, acquired by LG), former Head of Product where I led a company through an AI-era pivot. I now build AI systems for businesses through Fieldwork AI — the same kind you'll build in this room.
            </p>
            <p>
              I'm not here to sell you software. I'm here to make you dangerous with these tools in a single day — and to show you what's possible when you stop watching and start operating.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="section-label text-amber mb-4">Investment</p>
            <p className="font-syne font-semibold text-5xl text-slate mb-3">$1,000</p>
            <p className="font-inter text-base leading-body text-steel mb-6">
              for the day. Seats capped at 8. Includes the full day, lunch, every asset you build, and a 1:1 follow-up call afterward.
            </p>
            <div className="space-y-4 font-inter text-base text-steel">
              <div className="border-t border-slate/10 pt-4">
                <p className="font-syne font-semibold text-slate text-lg mb-1">Bring your right hand</p>
                <p className="text-amber font-syne font-semibold text-xl">50% off the second seat</p>
                <p className="text-sm text-steel/70 mt-1">Two people from one company makes adoption stick.</p>
              </div>
            </div>
            <p className="font-inter text-xs italic text-steel/70 mt-6 border-l-2 border-amber/40 pl-4">
              No payment required to reserve. Bring a check to the event, or I'll invoice you. Walk out with something useful or it's refunded.
            </p>
          </div>
          <div className="bg-slate p-8 md:p-10 flex flex-col justify-center">
            <p className="section-label text-amber mb-3">Next session</p>
            <p className="font-syne font-semibold text-2xl text-white mb-2">Thursday, July 30, 2026</p>
            <p className="font-inter text-base text-bone/70 mb-1">9:00am–3:30pm · Boise, ID</p>
            <p className="font-inter text-sm text-bone/50 mb-8">8 seats · runs monthly</p>
            <a
              href="/contact"
              className="font-inter text-sm font-medium bg-amber text-white px-8 py-4 hover:bg-[#C06A1F] transition-colors inline-block text-center"
            >
              Reserve your seat →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-10">Questions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {FAQ.map((item) => (
              <div key={item.q}>
                <p className="font-syne font-semibold text-lg text-white mb-2">{item.q}</p>
                <p className="font-inter text-sm leading-body text-bone/60">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        heading="One day. Hands on keyboard. Everything you build is yours."
        body="The next session is Thursday, July 30 in Boise. 8 seats."
        ctaLabel="Reserve your seat"
      />
      <Footer />
    </main>
  );
}
