import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";

export const metadata = {
  title: "AI for Business Leaders — 1-day intensive | Fieldwork AI",
  description:
    "A hands-on, in-person day in Boise for business owners and leaders. Get fluent in AI in a safe sandbox, map where it moves the needle in your business, and leave with a custom assistant and a plan.",
};

// NOTE: Gabe to fine-tune block titles, timings, and copy here.
const AGENDA = [
  {
    title: "The honest landscape",
    time: "30 min",
    body: "The 10-minute version of what actually matters in AI right now — hype killed, fear killed. Then we get to work.",
  },
  {
    title: "Hands-on in a safe sandbox",
    time: "90 min",
    body: "Learn the core moves by doing them — in a walled-off environment with example data, so you can experiment freely without any risk to your business.",
  },
  {
    title: "Roundtable: how your peers think about AI",
    time: "45 min",
    body: "Hear what other leaders in the room are trying, worried about, and betting on. Some of the best ideas come from the person next to you.",
  },
  {
    title: "Working lunch",
    time: "45 min",
    body: "Eat, talk, keep the momentum going. Lunch included.",
  },
  {
    title: "Map AI in your business",
    time: "60 min",
    body: "A simple framework and guided prompts walk you through it — you map where AI actually moves the needle for you, what to do first, and what to leave alone.",
  },
  {
    title: "Risk & security",
    time: "45 min",
    body: "What to watch for, what to never do, and how to roll AI out without exposing your business. You leave with a security checklist.",
  },
  {
    title: "Change management",
    time: "30 min",
    body: "The hard part isn't the tool — it's getting your team to use it. A practical plan for adoption that actually sticks.",
  },
  {
    title: "Your custom AI assistant + close",
    time: "30 min",
    body: "Stand up a custom AI assistant for your business, lock your first three moves, and book your 1:1 follow-up.",
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

// July schedule — keep this honest and current. Update statuses as bookings change.
const SESSIONS = [
  { date: "July 10", label: "Private session", status: "Closed", state: "closed" },
  { date: "July 22", label: "Private team training", status: "Closed", state: "closed" },
  { date: "July 28", label: "Private team training", status: "Closed", state: "closed" },
  { date: "July 30", label: "First open cohort", status: "8 seats", state: "open" },
  { date: "August", label: "New dates monthly", status: "Get notified", state: "soon" },
];

const DOT: Record<string, string> = {
  closed: "bg-bone/25",
  open: "bg-amber",
  soon: "border border-bone/30",
};

const SESSION_STATUS: Record<string, string> = {
  closed: "text-bone/40",
  open: "text-amber font-medium",
  soon: "text-bone/40",
};

export default function IntensivePage() {
  return (
    <main>
      <Nav />
      <PageHero
        motif
        eyebrow="One day · In person · Hands on keyboard"
        title={
          <>
            Walk in curious.
            <br />
            Walk out fluent.
          </>
        }
        subhead="Get genuinely good at AI in one focused day. A small-group, in-person day for Boise business owners and leaders — hands-on in a safe sandbox, then you map AI onto your own business, live. We work through what matters most: security, risk, and getting your team on board. You leave able to hold your own in any AI conversation, with a custom AI assistant already working for you."
      />

      {/* Event facts band */}
      <section className="bg-olive py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-center">
          <p className="font-inter text-sm text-bone/80"><span className="text-amber font-medium">Thursday, July 30</span> · 9:00am–3:30pm</p>
          <p className="font-inter text-sm text-bone/80">Boise, ID</p>
          <p className="font-inter text-sm text-bone/80">First open cohort · 8 seats</p>
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
            Hands-on all day. Fluent by the end.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <p className="font-syne font-semibold text-lg text-white mb-2">You learn by doing — not by watching.</p>
              <p className="font-inter text-sm leading-body text-bone/60">
                Hands-on exercises in a safe, walled-off sandbox with example data. You experiment freely, make mistakes safely, and build real fluency — not a stack of lecture notes.
              </p>
            </div>
            <div>
              <p className="font-syne font-semibold text-lg text-white mb-2">You map it to your own business.</p>
              <p className="font-inter text-sm leading-body text-bone/60">
                Guided exercises walk you through mapping where AI moves the needle in your company — you do the mapping, live, so you can keep doing it after. Plus how to manage the risk and the rollout. You leave knowing what to do Monday.
              </p>
            </div>
            <div>
              <p className="font-syne font-semibold text-lg text-white mb-2">You leave with assets, not just notes.</p>
              <p className="font-inter text-sm leading-body text-bone/60">
                A custom AI assistant, your opportunity map, a security checklist, a team-adoption plan, and the toolkit you practiced with. All yours to keep. Portable. Forkable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What you leave with — artifacts shown, not listed */}
      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-3">What you leave with</p>
          <h2 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-slate mb-3 leading-tight max-w-3xl">
            Not notes. Working things.
          </h2>
          <p className="font-inter text-base leading-body text-steel mb-12 max-w-2xl">
            You leave fluent — and with a folder of things built around your business, not a stack of slides.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Custom AI assistant */}
            <div className="bg-white rounded-lg p-5 shadow-xl border border-slate/10">
              <div className="rounded-md border border-slate/10 overflow-hidden bg-white">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate/[0.04] border-b border-slate/10">
                  <span className="w-2 h-2 rounded-full bg-amber/70" />
                  <span className="w-2 h-2 rounded-full bg-slate/20" />
                  <span className="w-2 h-2 rounded-full bg-slate/20" />
                  <span className="ml-2 font-inter text-[11px] text-steel">Acme Co. Assistant</span>
                </div>
                <div className="p-3 space-y-2">
                  <div className="ml-auto max-w-[82%] bg-amber/15 text-slate font-inter text-[11px] leading-snug rounded-lg rounded-br-sm px-3 py-2">
                    Draft a warm follow-up on the Henderson proposal.
                  </div>
                  <div className="max-w-[90%] bg-bone text-slate font-inter text-[11px] leading-snug rounded-lg rounded-bl-sm px-3 py-2 border border-slate/10">
                    Here's a draft — friendly, references your call on the 12th, and nudges next steps without being pushy…
                  </div>
                </div>
              </div>
              <p className="font-syne font-semibold text-base text-slate mt-4">Your custom AI assistant</p>
              <p className="font-inter text-xs leading-body text-steel mt-1">Set up around your business. Ready to use the next morning.</p>
            </div>

            {/* AI opportunity map */}
            <div className="bg-white rounded-lg p-5 shadow-xl border border-slate/10">
              <div className="rounded-md border border-slate/10 bg-white divide-y divide-slate/10">
                {[
                  ["Client intake & triage", "High impact"],
                  ["Proposal drafting", "Quick win"],
                  ["Status reporting", "Automate"],
                  ["Meeting notes → CRM", "Quick win"],
                ].map(([label, tag]) => (
                  <div key={label} className="flex items-center justify-between px-3 py-2.5">
                    <span className="font-inter text-[11px] text-slate">{label}</span>
                    <span className="font-inter text-[10px] font-medium text-[#B86A22] bg-amber/15 rounded-full px-2 py-0.5 whitespace-nowrap">
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-syne font-semibold text-base text-slate mt-4">Your AI opportunity map</p>
              <p className="font-inter text-xs leading-body text-steel mt-1">Where AI moves the needle, ranked — what to do first, what to skip.</p>
            </div>

            {/* AI security checklist */}
            <div className="bg-white rounded-lg p-5 shadow-xl border border-slate/10">
              <div className="rounded-md border border-slate/10 bg-white p-3 space-y-2.5">
                {[
                  "Approved AI tools only",
                  "No client data in public models",
                  "Access & permissions set",
                  "Team usage policy in place",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-amber/15 text-[#B86A22] text-[10px] flex items-center justify-center">✓</span>
                    <span className="font-inter text-[11px] text-slate">{item}</span>
                  </div>
                ))}
              </div>
              <p className="font-syne font-semibold text-base text-slate mt-4">Your AI security checklist</p>
              <p className="font-inter text-xs leading-body text-steel mt-1">Roll it out without exposing your business — the lines not to cross.</p>
            </div>
          </div>
          <p className="font-inter text-sm text-steel mt-8 max-w-3xl">
            Plus a <span className="text-slate font-medium">team-adoption plan</span> to get your people actually using it, and the full <span className="text-slate font-medium">toolkit</span> of prompts and templates you practiced with — yours to reuse. <span className="italic text-steel/70">Mockups are illustrative; yours are built around your business.</span>
          </p>
          <p className="font-inter text-sm italic text-steel mt-6 border-l-2 border-amber/40 pl-4 max-w-2xl">
            If you walk out without something you'll actually use, I'll refund the day. No forms. I'm not here to burn your money.
          </p>
        </div>
      </section>

      {/* The day */}
      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-3">The day · ~6 hours</p>
          <h2 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-white mb-12 leading-tight max-w-3xl">
            Hands-on and strategic, start to finish.
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

      {/* Testimonials */}
      <section className="bg-olive py-20 md:py-28 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-12">What people say</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <figure>
              <blockquote className="font-inter text-lg md:text-xl leading-relaxed text-bone/90">
                &ldquo;I&rsquo;ve worked alongside a lot of capable people. Gabe is the rare one who can do all three things that usually don&rsquo;t live in the same person: read a team accurately enough to coach them through real change, actually build the systems and automations himself, and roll them out so they stick. Most people do one of those and outsource the rest. <span className="text-white">He closes the whole loop from strategy to working system to adoption.</span> The teams he touches come out faster and clearer than they went in. If you&rsquo;re scaling and you need someone who can both see what&rsquo;s broken and build the fix, that&rsquo;s Gabe.&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-syne font-semibold text-white text-lg">Luke Larkin</p>
                <p className="font-inter text-sm text-bone/60">Owner, Larkin Systems</p>
              </figcaption>
            </figure>
            <figure>
              <blockquote className="font-inter text-lg md:text-xl leading-relaxed text-bone/90">
                &ldquo;I&rsquo;m just laughing at the drafts that are created. <span className="text-white">They&rsquo;re 1,000 times better than anything I could come up with</span> &mdash; and in no time.&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-syne font-semibold text-white text-lg">Matt Arriaga</p>
                <p className="font-inter text-sm text-bone/60">Owner, Arriaga Mediation</p>
              </figcaption>
            </figure>
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
              for the day. Limited to 8 seats — small by design, so the day stays hands-on. Includes the full day, lunch, every asset you build, and a 1:1 follow-up call afterward.
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
            <p className="section-label text-amber mb-2">The July schedule</p>
            <p className="font-inter text-sm leading-body text-bone/60 mb-6">
              Companies already bring this in-house. July 30 is the first session open to the public.
            </p>
            <div className="border-t border-white/10 mb-7">
              {SESSIONS.map((s) => (
                <div key={s.date} className="flex items-center gap-3 py-3 border-b border-white/10">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${DOT[s.state]}`} />
                  <span className="font-inter text-sm text-white w-20 shrink-0">{s.date}</span>
                  <span className="font-inter text-sm text-bone/55 flex-1">{s.label}</span>
                  <span className={`font-inter text-xs whitespace-nowrap ${SESSION_STATUS[s.state]}`}>{s.status}</span>
                </div>
              ))}
            </div>
            <p className="font-inter text-sm text-bone/70 mb-5">
              <span className="text-white font-medium">Thursday, July 30</span> · 9:00am–3:30pm · Boise, ID
            </p>
            <a
              href="/contact"
              className="font-inter text-sm font-medium bg-amber text-white px-8 py-4 hover:bg-[#C06A1F] transition-colors inline-block text-center"
            >
              Reserve one of 8 seats →
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
        heading="One day. Get fluent. Leave with AI working for your business."
        body="July 30 in Boise is the first cohort open to the public. 8 seats."
        ctaLabel="Reserve your seat"
      />
      <Footer />
    </main>
  );
}
