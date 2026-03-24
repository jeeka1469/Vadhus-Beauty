import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-secondary/50" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Premium Beauty Experience</span>
        </div>
        
        <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-semibold text-foreground mb-6 leading-tight text-balance">
          Unveil Your
          <br />
          <span className="text-primary">Natural Beauty</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed text-pretty">
          Experience the art of transformation at Vadhus Beauty. Our expert stylists 
          and beauticians are dedicated to enhancing your natural elegance with 
          premium services tailored just for you.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/booking">Book Your Appointment</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/services">Explore Services</Link>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { value: '10+', label: 'Years Experience' },
            { value: '5000+', label: 'Happy Clients' },
            { value: '50+', label: 'Beauty Services' },
            { value: '15+', label: 'Expert Stylists' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-sans text-3xl md:text-4xl font-semibold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
