export interface Service {
  id: string
  name: string
  category: string
  description: string | null
  price: number
  duration: number
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string | null
  service_id: string
  client_name: string
  client_phone: string
  client_email: string | null
  booking_date: string
  booking_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  source: 'online' | 'walkin' | 'phone'
  notes: string | null
  created_at: string
  updated_at: string
  service?: Service
}

export interface Invoice {
  id: string
  booking_id: string
  invoice_number: string
  amount: number
  tax: number
  total: number
  status: 'unpaid' | 'paid' | 'refunded'
  payment_method: string | null
  paid_at: string | null
  reminder_count?: number
  last_reminder_sent_at?: string | null
  next_reminder_at?: string | null
  created_at: string
  updated_at: string
  booking?: Booking
}

export interface Review {
  id: string
  user_id: string | null
  service_id: string | null
  rating: number
  comment: string | null
  reviewer_name: string | null
  is_approved: boolean
  created_at: string
  service?: Service
}

export interface Profile {
  id: string
  email: string | null
  phone: string | null
  full_name: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export const SERVICE_CATEGORIES = [
  'Facial',
  'Wax',
  'Nails',
  'Hair Treatment',
  'Colour',
  'Hair Cut',
  'Spa',
  'Others',
  'Essentials',
] as const
export type ServiceCategory = typeof SERVICE_CATEGORIES[number]

export const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const
export type BookingStatus = typeof BOOKING_STATUSES[number]

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00'
] as const
