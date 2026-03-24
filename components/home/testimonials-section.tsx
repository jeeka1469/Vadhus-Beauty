import { FALLBACK_REVIEWS, getApprovedReviews } from '@/lib/reviews'
import { Star, Quote } from 'lucide-react'
import type { Review } from '@/lib/types'

export async function TestimonialsSection() {
  const reviews = await getApprovedReviews(8)
  const reviewList: Array<Review | Pick<Review, 'id' | 'rating' | 'comment' | 'reviewer_name'>> =
    reviews.length > 0 ? reviews : FALLBACK_REVIEWS
  const midpoint = Math.ceil(reviewList.length / 2)
  const rowOne = reviewList.slice(0, midpoint)
  const rowTwo = reviewList.slice(midpoint)
  const safeRowTwo = rowTwo.length > 0 ? rowTwo : rowOne

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Client Love
          </span>
          <h2 className="font-sans text-4xl md:text-5xl font-semibold text-foreground mt-3 mb-5">
            What Our Clients Say
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Real experiences from our valued clients who have transformed with us.
          </p>
        </div>

        <div className="space-y-6">
          <div className="review-marquee-mask">
            <div className="review-marquee-track">
              {[...rowOne, ...rowOne].map((review, index) => (
                <article
                  key={`${review.id}-${index}`}
                  className="w-[340px] shrink-0 rounded-2xl border border-border bg-card p-6 relative"
                >
                  <Quote className="absolute top-5 right-5 h-6 w-6 text-primary/20" />

                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-border'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-foreground/85 leading-relaxed text-sm mb-5">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {review.reviewer_name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {review.reviewer_name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-muted-foreground">Verified Client</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="review-marquee-mask">
            <div className="review-marquee-track review-marquee-track-reverse">
              {[...safeRowTwo, ...safeRowTwo].map((review, index) => (
                <article
                  key={`${review.id}-${index}`}
                  className="w-[340px] shrink-0 rounded-2xl border border-border bg-card p-6 relative"
                >
                  <Quote className="absolute top-5 right-5 h-6 w-6 text-primary/20" />

                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-border'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-foreground/85 leading-relaxed text-sm mb-5">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {review.reviewer_name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {review.reviewer_name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-muted-foreground">Verified Client</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
