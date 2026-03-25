import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const reviewSchema = z.object({
  reviewer_name: z.string().trim().min(2).max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5).max(1200),
  service_id: z.string().uuid().optional().nullable(),
  website: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = reviewSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Please enter valid review details.' }, { status: 400 })
    }

    const { reviewer_name, rating, comment, service_id, website } = parsed.data

    // Honeypot for basic bot filtering.
    if (website && website.trim().length > 0) {
      return NextResponse.json({ success: true })
    }

    const supabase = await createClient()

    const { error } = await supabase.from('reviews').insert({
      reviewer_name,
      rating,
      comment,
      service_id: service_id || null,
      is_approved: true,
    })

    if (error) {
      console.error('Create review error:', error)
      return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
