const TESTIMONIALS = [
  {
    quote: (
      <>
        &ldquo;Gabe is the rare one who can do all three things that usually don&rsquo;t live in the same person: coach a team through real change, build the systems himself, and roll them out so they stick. <span className="text-white">He closes the whole loop &mdash; from strategy to working system to adoption.</span> The teams he touches come out faster and clearer than they went in.&rdquo;
      </>
    ),
    name: "Luke Larkin",
    title: "Owner, Larkin Systems",
  },
  {
    quote: (
      <>
        &ldquo;I&rsquo;m just laughing at the drafts that are created. <span className="text-white">They&rsquo;re 1,000 times better than anything I could come up with</span> &mdash; and in no time.&rdquo;
      </>
    ),
    name: "Matt Arriaga",
    title: "Owner, Arriaga Mediation",
  },
];

export default function Testimonials({ heading = "What people say" }: { heading?: string }) {
  return (
    <section className="bg-olive py-20 md:py-28 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <p className="section-label text-amber mb-12">{heading}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name}>
              <blockquote className="font-inter text-lg md:text-xl leading-relaxed text-bone/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-syne font-semibold text-white text-lg">{t.name}</p>
                <p className="font-inter text-sm text-bone/60">{t.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
