import Link from "next/link";

export default function CTABand({
  heading,
  body,
  ctaLabel = "Talk to me",
  ctaHref = "/contact",
}: {
  heading: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="bg-olive py-20 md:py-28 border-y border-white/10">
      <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
        <h2 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-white mb-5 leading-tight">
          {heading}
        </h2>
        {body && <p className="font-inter text-base md:text-lg leading-body text-bone/70 mb-8 max-w-2xl mx-auto">{body}</p>}
        <Link
          href={ctaHref}
          className="font-inter text-sm font-medium bg-amber text-white px-8 py-4 hover:bg-[#C06A1F] transition-colors inline-block"
        >
          {ctaLabel} →
        </Link>
      </div>
    </section>
  );
}
