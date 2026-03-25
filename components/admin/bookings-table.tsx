'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter,
  ChevronDown,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import type { Booking, Service } from '@/lib/types'

interface BookingWithService extends Booking {
  service: Service
}

interface BookingsTableProps {
  initialBookings: BookingWithService[]
}

const statusOptions = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const

export function BookingsTable({ initialBookings }: BookingsTableProps) {
  const router = useRouter()
  const [bookings, setBookings] = useState(initialBookings)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const filteredBookings = bookings.filter((booking) => {
    const multiServiceNames = booking.booking_services?.map((item) => item.service?.name).filter(Boolean).join(' ') || ''
    const matchesSearch = 
      booking.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client_phone.includes(searchQuery) ||
      booking.service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      multiServiceNames.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setIsUpdating(bookingId)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setBookings(prev => 
          prev.map(b => b.id === bookingId ? { ...b, status: newStatus as Booking['status'] } : b)
        )
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-amber-100 text-amber-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="font-sans">All Bookings</CardTitle>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-input rounded-lg bg-background text-sm appearance-none cursor-pointer w-full"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{booking.client_name}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {booking.client_phone}
                          </span>
                          {booking.client_email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {booking.client_email}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">{booking.service?.name}</p>
                      {booking.booking_services && booking.booking_services.length > 1 && (
                        <p className="text-xs text-muted-foreground">
                          +{booking.booking_services.length - 1} more service(s)
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">₹{booking.service?.price}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">
                        {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{booking.booking_time}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                        {booking.source === 'walkin' ? 'Walk-in' : booking.source}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              disabled={isUpdating === booking.id}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              disabled={isUpdating === booking.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              disabled={isUpdating === booking.id}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                            >
                              <a href={`/admin/invoices/create?booking=${booking.id}`}>
                                <FileText className="h-4 w-4 mr-1" />
                                Invoice
                              </a>
                            </Button>
                          </>
                        )}
                        {booking.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                          >
                            <a href={`/admin/invoices/create?booking=${booking.id}`}>
                              <FileText className="h-4 w-4 mr-1" />
                              Invoice
                            </a>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No bookings found
          </div>
        )}
      </CardContent>
    </Card>
  )
}
