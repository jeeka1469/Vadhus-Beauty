'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ReviewServiceOption {
  id: string
  name: string
}

interface ReviewSubmissionFormProps {
  services: ReviewServiceOption[]
}

export function ReviewSubmissionForm({ services }: ReviewSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    reviewer_name: '',
    service_id: '',
    rating: 5,
    comment: '',
    website: '',
  })

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewer_name: formData.reviewer_name,
          service_id: formData.service_id || null,
          rating: formData.rating,
          comment: formData.comment,
          website: formData.website,
        }),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to submit review')
      }

      setIsSuccess(true)
      setFormData({
        reviewer_name: '',
        service_id: '',
        rating: 5,
        comment: '',
        website: '',
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h3 className="font-sans text-2xl font-semibold text-foreground">Add Your Review</h3>
      <p className="mt-2 text-sm text-muted-foreground">Share your experience with Vadhus Beauty.</p>

      {isSuccess && (
        <p className="mt-4 rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-800">
          Thank you. Your review was submitted successfully.
        </p>
      )}

      <form onSubmit={submitReview} className="mt-6 space-y-5">
        <input
          type="text"
          value={formData.website}
          onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
          autoComplete="off"
          tabIndex={-1}
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="reviewer_name">Your Name *</Label>
            <Input
              id="reviewer_name"
              value={formData.reviewer_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, reviewer_name: e.target.value }))}
              className="mt-2"
              required
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="service_id">Service (Optional)</Label>
            <select
              id="service_id"
              value={formData.service_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, service_id: e.target.value }))}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">General Experience</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label>Rating *</Label>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, rating: value }))}
                className="rounded p-1"
                aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
              >
                <Star
                  className={`h-6 w-6 ${value <= formData.rating ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="comment">Comment *</Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
            rows={5}
            className="mt-2"
            required
            placeholder="Tell us about your experience"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  )
}
