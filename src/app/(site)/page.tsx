import { CtaSection } from "@/components/home/CtaSection";
import { EnergySection } from "@/components/home/EnergySection";
import { FaqSection } from "@/components/home/FaqSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TrustedBrands } from "@/components/home/TrustedBrands";
import { WhyKlimaENG } from "@/components/home/WhyKlimaENG";
import { prisma } from "@/lib/prisma";
import { getFeaturedProducts, toSnapshot } from "@/lib/products";

export const revalidate = 300;

export default async function HomePage() {
  const [featured, reviews, forCalc] = await Promise.all([
    getFeaturedProducts(4),
    prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.product.findMany({ where: { btu: { not: null } } }),
  ]);

  return (
    <>
      <Hero />
      <TrustedBrands />
      <FeaturedProducts
        products={featured.map((p) => ({
          ...toSnapshot(p),
          shortDesc: p.shortDesc,
          coverageM2: p.coverageM2,
          noiseDb: p.noiseDb,
          wifi: p.wifi,
          badge: p.badge,
          stock: p.stock,
        }))}
      />
      <WhyKlimaENG />
      <ServicesSection />
      <ProcessSection />
      <ProjectsSection />
      <EnergySection products={forCalc.map(toSnapshot)} />
      <ReviewsSection
        reviews={reviews.map((r) => ({
          id: r.id,
          authorName: r.authorName,
          city: r.city,
          rating: r.rating,
          text: r.text,
        }))}
      />
      <FaqSection />
      <CtaSection />
    </>
  );
}
