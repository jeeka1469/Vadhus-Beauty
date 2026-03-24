import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { FALLBACK_REVIEWS, getApprovedReviews } from '@/lib/reviews'
import { Quote, Heart, Sparkles, Star } from 'lucide-react'

const teamMembers = [
  { name: 'Vidhya Mileen Sonawane', role: 'Founder & Beauty Director', initials: 'VMS' },
  { name: 'Shruti More', role: 'Makeup Artist', initials: 'SM' },
  { name: 'Anchal Tiwari', role: 'Makeup Artist', initials: 'AT' },
  { name: 'Sulakshana', role: 'Makeup Artist', initials: 'SH' },
]

export default async function CommunityPage() {
  const reviews = await getApprovedReviews(12)
  const list = reviews.length > 0 ? reviews : FALLBACK_REVIEWS
  const rowOne = list.slice(0, Math.ceil(list.length / 2))
  const rowTwo = list.slice(Math.ceil(list.length / 2))

  return (
    <main className="min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-accent/30 via-background to-secondary/50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Behind The Brand
          </span>
          <h1 className="font-sans text-5xl md:text-6xl font-semibold text-foreground mt-3 mb-5 text-balance">
            Owner&apos;s Note & Vadhus Community
          </h1>
          <p className="max-w-3xl mx-auto text-muted-foreground text-lg">
            A personal space from our founder to share our philosophy, celebrate our team,
            and highlight the voices of clients who inspire us every day.
          </p>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-2">
              <div className="relative rounded-3xl border border-border bg-gradient-to-br from-primary/15 to-accent/50 p-8 h-[360px] flex flex-col justify-between">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-sans text-3xl font-semibold">
                  VMS
                </div>
                <div>
                  <p className="font-sans text-2xl font-semibold text-foreground">Vidhya Mileen Sonawane</p>
                  <p className="text-muted-foreground">Founder, Vadhus Beauty</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary text-sm font-medium mb-4">
                <Heart className="h-4 w-4" />
                A Note From The Owner
              </div>
              <h2 className="font-sans text-4xl font-semibold text-foreground mb-5 text-balance">
                Beauty is confidence, and confidence is what we create together.
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Vadhus Beauty was built with one intention: to make every client feel seen,
                  celebrated, and empowered. We don&apos;t chase trends blindly. We shape looks that
                  respect your personality and make you feel authentically beautiful.
                </p>
                <p>
                  Our commitment is simple: premium service, genuine care, and visible results.
                  Thank you for trusting us with your moments, from everyday glow-ups to your most
                  important occasions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary text-sm font-medium uppercase tracking-widest">Our Team</span>
            <h2 className="font-sans text-4xl md:text-5xl font-semibold text-foreground mt-3 mb-4">
              Faces Behind The Magic
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
              Skilled artists, warm hearts, and one shared mission: making you feel your best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl border border-border bg-card p-6 text-center hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary/25 to-accent/60 flex items-center justify-center">
                  <span className="font-sans text-2xl font-semibold text-primary">{member.initials}</span>
                </div>
                <h3 className="font-sans text-xl font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium uppercase tracking-widest">Client Reviews</span>
            <h2 className="font-sans text-4xl md:text-5xl font-semibold text-foreground mt-3 mb-4">
              Love Notes In Motion
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
              Real experiences from our clients, moving continuously just like our growth.
            </p>
          </div>

          <div className="space-y-6">
            <div className="review-marquee-mask">
              <div className="review-marquee-track">
                {[...rowOne, ...rowOne].map((review, index) => (
                  <article
                    key={`${review.id}-${index}`}
                    className="w-[340px] shrink-0 rounded-2xl border border-border bg-background p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < (review.rating || 0) ? 'fill-yellow-500' : ''}`}
                          />
                        ))}
                      </div>
                      <Quote className="h-5 w-5 text-primary/25" />
                    </div>
                    <p className="text-foreground/85 leading-relaxed text-sm">&ldquo;{review.comment}&rdquo;</p>
                    <p className="mt-4 text-sm font-medium text-primary">{review.reviewer_name || 'Verified Client'}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="review-marquee-mask">
              <div className="review-marquee-track review-marquee-track-reverse">
                {[...rowTwo, ...rowTwo].map((review, index) => (
                  <article
                    key={`${review.id}-${index}`}
                    className="w-[340px] shrink-0 rounded-2xl border border-border bg-background p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        Verified Review
                      </div>
                      <Quote className="h-5 w-5 text-primary/25" />
                    </div>
                    <p className="text-foreground/85 leading-relaxed text-sm">&ldquo;{review.comment}&rdquo;</p>
                    <p className="mt-4 text-sm font-medium text-primary">{review.reviewer_name || 'Verified Client'}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
