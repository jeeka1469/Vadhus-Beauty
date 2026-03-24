import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-sans text-2xl font-semibold mb-4">Vadhus Beauty</h3>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              Experience beauty services that enhance your natural elegance. 
              Our expert team is dedicated to making you look and feel your absolute best.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/vadhus_beauty/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-background/10 rounded-full hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-background/10 rounded-full hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/services', label: 'Our Services' },
                { href: '/booking', label: 'Book Appointment' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-background/70 hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {['Hair Styling', 'Makeup', 'Nail Care', 'Skin Care', 'Spa & Massage'].map((service) => (
                <li key={service}>
                  <Link 
                    href="/services"
                    className="text-background/70 hover:text-primary text-sm transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm">
                  104 A Wing, Ram Kutir Residency, Asalpha, <br />
                  Mumbai, Maharashtra 400053
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+917506528283" className="text-background/70 hover:text-primary text-sm transition-colors">
                  +91 7506528283
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:vadhusbeauty@gmail.com" className="text-background/70 hover:text-primary text-sm transition-colors">
                  vadhusbeauty@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <span className="text-background/70 text-sm">
                  Entire Week: 9AM - 8PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            &copy; {new Date().getFullYear()} Vadhus Beauty. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-background/50 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-background/50 hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
