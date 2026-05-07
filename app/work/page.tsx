import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { SELECTED_WORK, OPERATOR_HISTORY } from "@/lib/constants";

export const metadata = {
  title: "Selected Work | Fieldwork AI",
  description: "Real artifacts. Real businesses. Yours when we're done. Plus the operator history behind the consulting.",
};

export default function WorkPage() {
  return (
    <main>
      <Nav />
      <PageHero
        eyebrow="Selected work"
        title="Real artifacts. Real businesses. Yours when we're done."
        subhead="A short list. Most of my work is under NDA or in-flight. These are the ones I can show. If you want to see something specific to your industry, ask — I usually have something I can share over a call."
      />

      <section className="bg-bone py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-10">
          {SELECTED_WORK.map((w) => (
            <article key={w.slug} className="border border-dust bg-white p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                  <p className="section-label text-amber mb-2">{w.kicker}</p>
                  <h3 className="font-syne font-semibold text-2xl md:text-3xl tracking-tight text-slate">{w.name}</h3>
                </div>
                {w.url && (
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-inter text-sm font-medium text-amber hover:text-slate border border-amber/40 hover:border-slate px-5 py-2.5 transition-colors duration-200 self-start inline-flex items-center gap-2"
                  >
                    {w.url.replace(/^https?:\/\//, "")}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>

              <p className="font-inter text-base leading-body text-steel mb-5 max-w-3xl">{w.summary}</p>
              <p className="font-inter text-sm leading-body text-steel/80 mb-8 max-w-3xl italic border-l-2 border-amber/40 pl-4">
                {w.portable}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-dust pt-8">
                {w.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="font-syne font-semibold text-base text-slate mb-1">{m.label}</p>
                    <p className="font-inter text-xs text-steel/60">{m.sub}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">Operator background</p>
          <h2 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-white mb-6 max-w-3xl leading-tight">
            The ops résumé behind the consulting.
          </h2>
          <p className="font-inter text-base leading-body text-bone/60 mb-12 max-w-2xl">
            Before Fieldwork, I was on the building side of:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {OPERATOR_HISTORY.map((c) => (
              <div key={c.co} className="border border-white/10 p-6">
                <p className="font-syne font-semibold text-lg text-white mb-1">{c.co}</p>
                <p className="font-inter text-sm text-amber mb-2">{c.role}</p>
                {c.note && <p className="font-inter text-xs text-bone/50">{c.note}</p>}
              </div>
            ))}
          </div>

          <p className="font-inter text-base leading-body text-bone/60 max-w-3xl">
            Forbes 30 Under 30 (2015). MIT Mechanical Engineering. When I tell a SaaS CEO what to do with their roadmap, I've sat in their chair. When I tell a service business owner what to automate, I've built the systems myself.
          </p>
        </div>
      </section>

      <CTABand
        heading="Want to see more?"
        body="A lot of my work is under NDA or live with active clients. Tell me what you're trying to do and I'll usually have something I can share over a call."
      />
      <Footer />
    </main>
  );
}
