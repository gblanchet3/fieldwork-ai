import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CTABand from "@/components/CTABand";
import { PRINCIPLES } from "@/lib/constants";

export const metadata = {
  title: "About | Fieldwork AI",
  description: "I'm Gabe Blanchet. I build with people, not for them. Personalized AI coaching and implementation, from a 10+ year operator.",
};

export default function AboutPage() {
  return (
    <main>
      <Nav />

      <section className="relative bg-slate pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 30%, transparent 40%, #0F1923 100%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="section-label text-amber mb-5">About</p>
            <h1 className="font-syne font-semibold text-4xl md:text-6xl tracking-tightest text-white leading-[1.05] mb-6">
              I'm Gabe. I build with people, not for them.
            </h1>
            <p className="font-inter text-lg leading-body text-bone/70 max-w-xl">
              This is a one-person business with a small bench of senior operators when projects need depth. No agency overhead. No consultancy bloat. Direct access, fast cycles, portable artifacts.
            </p>
          </div>
          <div className="aspect-[4/5] relative overflow-hidden border border-white/10">
            <Image src="/founder.jpeg" alt="Gabe Blanchet, founder of Fieldwork AI" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
          </div>
        </div>
      </section>

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">The longer version</p>
          <div className="space-y-5 font-inter text-base md:text-lg leading-body text-steel">
            <p>
              I trained as a mechanical engineer at MIT, then spent the next decade building software companies. I co-founded <strong>Grove Labs</strong> out of school — we raised $6M, built a hardware-software product for indoor farming, and got acquired by LG. From there: <strong>Imbellus</strong>, <strong>Revonate</strong> (as CTO), <strong>Maxable</strong> (as CEO), and most recently <strong>LeanLaw</strong>, where I led product through the company's pivot from SaaS billing into payments and financial services.
            </p>
            <p>
              Somewhere in there I walked the Appalachian Trail. 2,181 miles. Six months. It taught me a lot of things I still use, but the most useful one was this: <em>the right pack is the one you can actually carry</em>.
            </p>
            <p>
              I think about software the same way. The right system is the one you can actually run.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10 mb-12">
          <p className="section-label text-amber mb-4">Why Fieldwork</p>
          <p className="font-inter text-base md:text-lg leading-body text-bone/70 mb-5">
            The AI revolution is real, but most of what's being sold against it is bad — courses you won't finish, SaaS that locks your data behind someone else's UI, big-firm consultants who hand you a deck and disappear. None of that helps an operator actually use this stuff well.
          </p>
          <p className="font-inter text-base md:text-lg leading-body text-bone/70">
            What does help is sitting with someone, on their real work, and building artifacts they own. That's what I do.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-6">Principles</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} className="border border-white/10 p-8">
                <p className="font-syne font-semibold text-amber text-2xl mb-4">0{i + 1}</p>
                <h3 className="font-syne font-semibold text-lg text-white mb-3 leading-snug">{p.title}</h3>
                <p className="font-inter text-sm leading-body text-bone/60">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="section-label text-amber mb-4">How I work with others</p>
            <p className="font-inter text-base leading-body text-steel">
              I'm a one-person business by design — direct access, no overhead. When projects need specialized depth, I bring in a small bench of senior operators I've worked with for years: ex-product, ex-engineering, ex-PE, depending on the engagement. Right-sized teams, no consultancy bloat. You always know who's doing the work.
            </p>
          </div>
          <div>
            <p className="section-label text-amber mb-4">Outside work</p>
            <p className="font-inter text-base leading-body text-steel">
              Boise, Idaho. Married to Amanda. Two kids — Winter (2) and Brooks (newborn) — and a dog named Kavu. I try to live what I write about: minimal noise, real artifacts, things you can actually use.
            </p>
          </div>
        </div>
      </section>

      <CTABand heading="Talk to me." body="A 30-minute call. No slides, no pitch deck. We'll find your highest-leverage move." />
      <Footer />
    </main>
  );
}
