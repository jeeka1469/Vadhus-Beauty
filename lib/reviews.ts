import { createClient } from '@/lib/supabase/server'
import type { Review } from '@/lib/types'

export const FALLBACK_REVIEWS: Array<Pick<Review, 'id' | 'rating' | 'comment' | 'reviewer_name'>> = [
  {
    id: 'r1',
    rating: 5,
    comment: 'Absolutely loved the service and the warm behavior. My hair has never looked better.',
    reviewer_name: 'Savita Deshpandey.',
  },
  {
    id: 'r2',
    rating: 5,
    comment: 'Very hygienic, super polite team, and amazing results for my engagement look.',
    reviewer_name: 'Bharti Tai.',
  },
  {
    id: 'r3',
    rating: 5,
    comment: 'They really listen to what you want. I always leave feeling confident and happy.',
    reviewer_name: 'Surekha.',
  },
  {
    id: 'r4',
    rating: 5,
    comment: 'Great value and premium feel. Staff is skilled and the ambiance is beautiful.',
    reviewer_name: 'Saanchi S.',
  },
  {
    id: 'r5',
    rating: 5,
    comment: 'Booked for bridal services and everything was perfectly managed from start to finish.',
    reviewer_name: 'Srujan K.',
  },
  {
    id: 'r6',
    rating: 5,
    comment: 'My go-to salon now. Consistent quality and lovely team energy every single time.',
    reviewer_name: 'Nidhi S.',
  },
]

export async function getApprovedReviews(limit = 12): Promise<Review[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data || []
}
