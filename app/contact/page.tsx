'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    website: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to send message')
      }

      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '', website: '' })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/30 via-background to-secondary/50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Get in Touch
          </span>
          <h1 className="font-sans text-5xl md:text-6xl font-semibold text-foreground mt-3 mb-5">
            Contact Us
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Have questions or want to book a consultation? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-sans text-3xl font-semibold text-foreground mb-6">
                Send Us a Message
              </h2>
              
              {isSuccess ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-sans text-xl font-semibold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We will get back to you within 24 hours.
                    </p>
                    <Button onClick={() => {
                      setIsSuccess(false)
                      setSubmitError(null)
                      setFormData({ name: '', email: '', phone: '', message: '', website: '' })
                    }}>
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    autoComplete="off"
                    tabIndex={-1}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Your phone number"
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you?"
                      rows={5}
                      className="mt-2"
                      required
                    />
                  </div>
                  {submitError && (
                    <p className="text-sm text-destructive">{submitError}</p>
                  )}
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-sans text-3xl font-semibold text-foreground mb-6">
                Visit Our Salon
              </h2>
              
              <div className="space-y-6 mb-10">
                {[
                  {
                    icon: MapPin,
                    title: 'Address',
                    content: ['104 A Wing, Ram Kutir Residency, Asalpha', 'Mumbai, Maharashtra 400053'],
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    content: ['+91 7506528283'],
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    content: ['vadhusbeauty@gmail.com'],
                  },
                  {
                    icon: Clock,
                    title: 'Hours',
                    content: ['Entire Week: 9AM - 8PM'],
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                      {item.content.map((line, i) => (
                        <p key={i} className="text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted rounded-2xl h-72 flex items-center justify-center text-center px-6">
                <div>
                  <p className="font-medium text-foreground">Vadhus Beauty Location</p>
                  <p className="text-muted-foreground mt-2">
                    104 A Wing, Ram Kutir Residency, Asalpha, Mumbai, Maharashtra 400053
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
