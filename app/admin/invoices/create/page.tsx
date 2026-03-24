'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'

interface Booking {
  id: string
  client_name: string
  client_phone: string
  client_email: string | null
  booking_date: string
  service: {
    name: string
    price: number
  }
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking')

  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    booking_id: bookingId || '',
    amount: 0,
    tax_rate: 18, // GST
    payment_method: 'cash',
    mark_as_paid: false,
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    if (bookingId && bookings.length > 0) {
      const booking = bookings.find(b => b.id === bookingId)
      if (booking) {
        setSelectedBooking(booking)
        setFormData(prev => ({
          ...prev,
          booking_id: booking.id,
          amount: booking.service.price,
        }))
      }
    }
  }, [bookingId, bookings])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      // Filter bookings that are confirmed or completed and don't have invoices
      const eligibleBookings = data.bookings?.filter(
        (b: { status: string }) => b.status === 'confirmed' || b.status === 'completed'
      ) || []
      setBookings(eligibleBookings)
    } catch {
      setError('Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookingSelect = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId)
    if (booking) {
      setSelectedBooking(booking)
      setFormData(prev => ({
        ...prev,
        booking_id: booking.id,
        amount: booking.service.price,
      }))
    }
  }

  const taxAmount = (formData.amount * formData.tax_rate) / 100
  const totalAmount = formData.amount + taxAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: formData.booking_id,
          amount: formData.amount,
          tax: taxAmount,
          total: totalAmount,
          payment_method: formData.mark_as_paid ? formData.payment_method : null,
          status: formData.mark_as_paid ? 'paid' : 'unpaid',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create invoice')
      }

      router.push('/admin/invoices')
    } catch {
      setError('Failed to create invoice. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/invoices">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="font-sans text-3xl font-semibold text-foreground">Create Invoice</h1>
          <p className="text-muted-foreground mt-1">Generate a new invoice for a booking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Booking Selection */}
                <div>
                  <Label htmlFor="booking">Select Booking</Label>
                  <select
                    id="booking"
                    value={formData.booking_id}
                    onChange={(e) => handleBookingSelect(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-input rounded-lg bg-background"
                    required
                  >
                    <option value="">Select a booking...</option>
                    {bookings.map((booking) => (
                      <option key={booking.id} value={booking.id}>
                        {booking.client_name} - {booking.service.name} ({new Date(booking.booking_date).toLocaleDateString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <Label htmlFor="amount">Service Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="mt-2"
                    required
                  />
                </div>

                {/* Tax Rate */}
                <div>
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
                    className="mt-2"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Mark as Paid */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="mark_as_paid"
                    checked={formData.mark_as_paid}
                    onChange={(e) => setFormData({ ...formData, mark_as_paid: e.target.checked })}
                    className="h-4 w-4 rounded border-input"
                  />
                  <Label htmlFor="mark_as_paid" className="cursor-pointer">
                    Mark as paid
                  </Label>
                </div>

                {/* Payment Method */}
                {formData.mark_as_paid && (
                  <div>
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <select
                      id="payment_method"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-full mt-2 px-3 py-2 border border-input rounded-lg bg-background"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    {error}
                  </p>
                )}

                <Button type="submit" disabled={isSubmitting || !formData.booking_id}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Invoice'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Invoice Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBooking ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{selectedBooking.client_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.client_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{selectedBooking.service.name}</p>
                  </div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{formData.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax ({formData.tax_rate}%)</span>
                      <span>₹{taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Select a booking to preview
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
