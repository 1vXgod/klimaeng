import { MapPin, Quote } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type ReviewData = {
  id: string;
  authorName: string;
  city: string | null;
  rating: number;
  text: string;
};

export function ReviewsSection({ reviews }: { reviews: ReviewData[] }) {
  return (
    <section className="bg-surface py-20 md:py-28" aria-label="Vlerësimet e klientëve">
      <div className="container-site">
        <SectionHeading
          eyebrow="Vlerësimet"
          title="Çfarë thonë klientët tanë"
          description="Mbi 950 familje dhe biznese na besojnë komfortin e tyre — disa fjalë nga ta."
        />

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={Math.min(i * 0.07, 0.28)} className="break-inside-avoid">
              <figure className="rounded-3xl border border-line bg-bg p-6 transition-all duration-300 hover:-translate-y-1 hover:card-shadow-lg md:p-7">
                <div className="flex items-center justify-between">
                  <Rating value={review.rating} />
                  <Quote size={22} className="text-brand-200 dark:text-brand-500/30" />
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-ink-2">
                  “{review.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-frost-500 text-sm font-bold text-white">
                    {review.authorName
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{review.authorName}</p>
                    {review.city && (
                      <p className="flex items-center gap-1 text-xs text-muted">
                        <MapPin size={11} />
                        {review.city}
                      </p>
                    )}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
