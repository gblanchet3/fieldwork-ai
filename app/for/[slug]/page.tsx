import { notFound } from "next/navigation";
import type { Metadata } from "next";
import businesses from "@/data/businesses.json";
import { Business } from "@/lib/types";
import ForHero from "@/components/for/ForHero";
import OpportunityCard from "@/components/for/OpportunityCard";
import SocialProof from "@/components/for/SocialProof";
import GabeBlock from "@/components/for/GabeBlock";
import ForCTA from "@/components/for/ForCTA";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (businesses as Business[]).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const business = (businesses as Business[]).find((b) => b.slug === params.slug);
  if (!business) return {};
  return {
    title: `AI Analysis for ${business.name} — Fieldwork AI`,
    description: `We found ${business.opportunities.length} AI opportunities for ${business.name} in ${business.city}. See what we found.`,
    robots: { index: false, follow: false },
  };
}

export default function BusinessPage({ params }: { params: { slug: string } }) {
  const business = (businesses as Business[]).find((b) => b.slug === params.slug);
  if (!business) notFound();

  const accent = business.brandColor || "#D97B2A";

  return (
    <main
      className="min-h-screen bg-slate"
      style={{ "--brand-color": accent } as React.CSSProperties}
    >
      <ForHero business={business} />

      {/* Opportunities */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-10 space-y-4" aria-label="AI opportunities">
        <p className="section-label text-amber mb-6">What we found</p>
        {business.opportunities.map((opp, i) => (
          <OpportunityCard
            key={opp.type}
            opportunity={opp}
            index={i}
            brandColor={accent}
          />
        ))}
      </section>

      {/* Social proof + About + CTA */}
      <div className="max-w-3xl mx-auto px-6 md:px-10 space-y-10 pb-4">
        <SocialProof business={business} />
        <GabeBlock />
        <ForCTA business={business} />
      </div>
    </main>
  );
}
