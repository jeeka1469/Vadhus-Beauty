import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BookingForm } from '@/components/booking/booking-form'
import { createClient } from '@/lib/supabase/server'
import type { Service } from '@/lib/types'

interface BookingPageProps {
  searchParams: Promise<{ service?: string }>
}

async function getServices(): Promise<Service[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('name')

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data || []
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams
  const services = await getServices()

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/30 via-background to-secondary/50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Reserve Your Spot
          </span>
          <h1 className="font-sans text-4xl md:text-5xl font-semibold text-foreground mt-3 mb-5">
            Book an Appointment
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Select your desired service, choose a convenient time, and let us 
            take care of the rest.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
            <BookingForm services={services} preSelectedServiceId={params.service} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  )
}
