import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, Calendar } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-sans text-4xl md:text-5xl font-semibold text-primary-foreground mb-6 text-balance">
          Ready to Experience Beauty Services?
        </h2>
        <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Book your appointment today and let our expert team create a personalized 
          beauty experience just for you.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            <Link href="/booking" className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Book Online
            </Link>
          </Button>
          <Button 
            asChild 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <a href="tel:+919876543210" className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call Us
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
