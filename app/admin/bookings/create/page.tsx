import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CreateBookingForm } from '@/components/admin/create-booking-form'
import type { Service } from '@/lib/types'

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

export default async function CreateAdminBookingPage() {
  const services = await getServices()

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>
        <div>
          <h1 className="font-sans text-3xl font-semibold text-foreground">Add Offline Booking</h1>
          <p className="mt-1 text-muted-foreground">Create a manual booking from walk-in or phone requests</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <CreateBookingForm services={services} />
          ) : (
            <p className="text-muted-foreground">No active services found. Please add services first.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
