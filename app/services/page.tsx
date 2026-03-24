import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CategoryFilter } from '@/components/services/category-filter'
import { ServiceCard } from '@/components/services/service-card'
import { createClient } from '@/lib/supabase/server'
import type { Service } from '@/lib/types'

interface ServicesPageProps {
  searchParams: Promise<{ category?: string }>
}

async function getServices(category?: string): Promise<Service[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('price')

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data || []
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams
  const services = await getServices(params.category)

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/30 via-background to-secondary/50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Our Offerings
          </span>
          <h1 className="font-sans text-5xl md:text-6xl font-semibold text-foreground mt-3 mb-5">
            Beauty Services
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Explore our comprehensive range of premium beauty services designed 
            to enhance your natural beauty and leave you feeling refreshed.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-background sticky top-0 z-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <Suspense fallback={<div className="h-10" />}>
            <CategoryFilter />
          </Suspense>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="font-sans text-2xl text-foreground mb-3">
                No services found
              </h3>
              <p className="text-muted-foreground">
                Try selecting a different category or check back later.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
