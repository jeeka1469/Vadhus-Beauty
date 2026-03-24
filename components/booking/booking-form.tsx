'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Service } from '@/lib/types'
import { TIME_SLOTS } from '@/lib/types'

interface BookingFormProps {
  services: Service[]
  preSelectedServiceId?: string
}

export function BookingForm({ services, preSelectedServiceId }: BookingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    serviceId: preSelectedServiceId || '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  })

  const selectedService = services.find(s => s.id === formData.serviceId)

  // Generate available dates (next 30 days, excluding Sundays)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date
  }).filter(date => date.getDay() !== 0) // Exclude Sundays

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
          booking_date: formData.date,
          booking_time: formData.time,
          client_name: formData.name,
          client_phone: formData.phone,
          client_email: formData.email || null,
          notes: formData.notes || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      setIsSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="font-sans text-3xl font-semibold text-foreground mb-4">
          Booking Confirmed!
        </h2>
        <p className="text-muted-foreground mb-8">
          Thank you for booking with Vadhus Beauty. We will send you a confirmation 
          shortly. We look forward to seeing you!
        </p>
        <div className="bg-card rounded-xl p-6 border border-border text-left mb-8">
          <h3 className="font-medium text-foreground mb-4">Booking Details</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Service:</span> {selectedService?.name}</p>
            <p><span className="text-muted-foreground">Date:</span> {new Date(formData.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><span className="text-muted-foreground">Time:</span> {formData.time}</p>
            <p><span className="text-muted-foreground">Name:</span> {formData.name}</p>
          </div>
        </div>
        <Button onClick={() => router.push('/')}>
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 mx-2 rounded ${
                  step > s ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="animate-in fade-in">
            <h2 className="font-sans text-2xl font-semibold text-foreground mb-6 text-center">
              Select a Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => setFormData({ ...formData, serviceId: service.id })}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    formData.serviceId === service.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-primary">
                      {service.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {service.duration} min
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{service.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                    {service.description}
                  </p>
                  <p className="font-sans text-lg font-semibold text-primary">
                    ₹{service.price.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.serviceId}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="animate-in fade-in">
            <h2 className="font-sans text-2xl font-semibold text-foreground mb-6 text-center">
              Choose Date & Time
            </h2>
            
            {/* Date Selection */}
            <div className="mb-8">
              <Label className="flex items-center gap-2 mb-4 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Select Date
              </Label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {availableDates.slice(0, 14).map((date) => {
                  const dateStr = date.toISOString().split('T')[0]
                  return (
                    <button
                      type="button"
                      key={dateStr}
                      onClick={() => setFormData({ ...formData, date: dateStr })}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        formData.date === dateStr
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xs opacity-80">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="font-semibold">{date.getDate()}</div>
                      <div className="text-xs opacity-80">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <Label className="flex items-center gap-2 mb-4 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Select Time
              </Label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    type="button"
                    key={time}
                    onClick={() => setFormData({ ...formData, time })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.time === time
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                disabled={!formData.date || !formData.time}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <div className="animate-in fade-in">
            <h2 className="font-sans text-2xl font-semibold text-foreground mb-6 text-center">
              Your Details
            </h2>

            {/* Booking Summary */}
            <div className="bg-primary/5 rounded-xl p-6 mb-8 border border-primary/20">
              <h3 className="font-medium text-foreground mb-4">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Service:</span>
                  <p className="font-medium">{selectedService?.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <p className="font-medium">₹{selectedService?.price.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">
                    {new Date(formData.date).toLocaleDateString('en-IN', { 
                      weekday: 'short', month: 'short', day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <p className="font-medium">{formData.time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Special Requests (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                type="submit"
                disabled={!formData.name || !formData.phone || isSubmitting}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
