import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Award, Heart, Users, Star } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/30 via-background to-secondary/50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Our Story
          </span>
          <h1 className="font-sans text-5xl md:text-6xl font-semibold text-foreground mt-3 mb-5 text-balance">
            About Vadhus Beauty
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Where beauty meets expertise. Discover our journey of transforming 
            lives through the art of beauty.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-sans text-4xl font-semibold text-foreground mb-6">
                A Legacy of Beauty Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded over a decade ago, Vadhus Beauty began with a simple vision: 
                  to create a sanctuary where every person could discover and enhance 
                  their natural beauty. What started as a small salon has grown into 
                  one of the most trusted names in premium beauty services.
                </p>
                <p>
                  Our founder, Vidya Mileen Sonawane, believed that true beauty comes from within and 
                  that our role is to help it shine through. This philosophy has guided 
                  every aspect of our service, from the products we use to the techniques 
                  we employ.
                </p>
                <p>
                  Today, our team of highly trained professionals continues this legacy, 
                  combining traditional techniques with modern innovations to deliver 
                  exceptional results for every client who walks through our doors.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-3xl h-96 flex items-center justify-center">
              <span className="font-sans text-6xl text-primary/30">VB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              What We Believe
            </span>
            <h2 className="font-sans text-4xl md:text-5xl font-semibold text-foreground mt-3">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: 'Excellence',
                description: 'We pursue perfection in every service, using only premium products and techniques.',
              },
              {
                icon: Heart,
                title: 'Care',
                description: 'Every client is treated with warmth, respect, and personalized attention.',
              },
              {
                icon: Award,
                title: 'Expertise',
                description: 'Our team undergoes continuous training to stay ahead of beauty trends.',
              },
              {
                icon: Users,
                title: 'Community',
                description: 'We build lasting relationships with our clients, becoming part of their lives.',
              },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-sans text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-sans text-4xl font-semibold text-primary-foreground mb-6">
            Ready to Experience Vadhus Beauty?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10">
            Join thousands of satisfied clients who have discovered their best selves with us.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/booking">Book Your Appointment</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
