import { createClient } from '@/lib/supabase/server'
import { BookingsTable } from '@/components/admin/bookings-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

async function getBookings() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(id, name, price, duration)
    `)
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }

  return data || []
}

export default async function BookingsPage() {
  const bookings = await getBookings()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-semibold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage all customer appointments</p>
        </div>
        <Button asChild>
          <Link href="/admin/bookings/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Offline Booking
          </Link>
        </Button>
      </div>

      <BookingsTable initialBookings={bookings} />
    </div>
  )
}
