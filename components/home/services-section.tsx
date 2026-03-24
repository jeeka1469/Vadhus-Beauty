import Link from 'next/link'
import { Scissors, Palette, Sparkles, Heart, Flower2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const services = [
  {
    icon: Scissors,
    title: 'Hair Styling',
    description: 'From trendy cuts to stunning colors, our expert stylists create looks that perfectly complement your personality.',
    href: '/services?category=Hair',
  },
  {
    icon: Palette,
    title: 'Makeup',
    description: 'Whether bridal glamour or everyday elegance, our makeup artists enhance your natural beauty for any occasion.',
    href: '/services?category=Makeup',
  },
  {
    icon: Sparkles,
    title: 'Nail Care',
    description: 'Indulge in luxurious manicures and pedicures with creative nail art that expresses your unique style.',
    href: '/services?category=Nails',
  },
  {
    icon: Heart,
    title: 'Skin Care',
    description: 'Rejuvenate your skin with our premium facials and treatments designed for radiant, healthy skin.',
    href: '/services?category=Skin',
  },
  {
    icon: Flower2,
    title: 'Spa & Massage',
    description: 'Escape into relaxation with our therapeutic massages and body treatments that restore mind and body.',
    href: '/services?category=Spa',
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            What We Offer
          </span>
          <h2 className="font-sans text-4xl md:text-5xl font-semibold text-foreground mt-3 mb-5">
            Our Services
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Discover our comprehensive range of beauty services designed to pamper, 
            rejuvenate, and transform you.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group bg-background rounded-2xl p-8 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-sans text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {service.description}
              </p>
              <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}

          {/* CTA Card */}
          <div className="bg-primary rounded-2xl p-8 flex flex-col justify-center text-primary-foreground">
            <h3 className="font-sans text-2xl font-semibold mb-4">
              Ready to Transform?
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Book your appointment today and let our experts reveal your most beautiful self.
            </p>
            <Button 
              asChild 
              variant="secondary" 
              className="w-fit"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
