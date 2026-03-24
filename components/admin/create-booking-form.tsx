'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Service, Booking } from '@/lib/types'

interface CreateBookingFormProps {
  services: Service[]
}

export function CreateBookingForm({ services }: CreateBookingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const [formData, setFormData] = useState({
    serviceId: services[0]?.id || '',
    bookingDate: today,
    bookingTime: '10:00',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: '',
    source: 'walkin' as Booking['source'],
    status: 'confirmed' as Booking['status'],
  })

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: formData.serviceId,
          booking_date: formData.bookingDate,
          booking_time: formData.bookingTime,
          client_name: formData.clientName,
          client_phone: formData.clientPhone,
          client_email: formData.clientEmail || null,
          notes: formData.notes || null,
          source: formData.source,
          status: formData.status,
        }),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to create booking')
      }

      router.push('/admin/bookings')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="service">Service *</Label>
          <select
            id="service"
            required
            value={formData.serviceId}
            onChange={(e) => updateField('serviceId', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - INR {Number(service.price).toLocaleString('en-IN')}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Booking Source *</Label>
          <select
            id="source"
            required
            value={formData.source}
            onChange={(e) => updateField('source', e.target.value as Booking['source'])}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="walkin">Walk-in</option>
            <option value="phone">Phone</option>
            <option value="online">Online</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bookingDate">Date *</Label>
          <Input
            id="bookingDate"
            type="date"
            required
            value={formData.bookingDate}
            onChange={(e) => updateField('bookingDate', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookingTime">Time *</Label>
          <Input
            id="bookingTime"
            type="time"
            required
            value={formData.bookingTime}
            onChange={(e) => updateField('bookingTime', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            required
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value as Booking['status'])}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            required
            value={formData.clientName}
            onChange={(e) => updateField('clientName', e.target.value)}
            placeholder="Enter client full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhone">Client Phone *</Label>
          <Input
            id="clientPhone"
            required
            value={formData.clientPhone}
            onChange={(e) => updateField('clientPhone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientEmail">Client Email (Optional)</Label>
        <Input
          id="clientEmail"
          type="email"
          value={formData.clientEmail}
          onChange={(e) => updateField('clientEmail', e.target.value)}
          placeholder="name@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          rows={4}
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Any details from offline booking conversation"
        />
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Create Booking'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/bookings')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
