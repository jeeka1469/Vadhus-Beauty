-- Add support for multi-service bookings.
CREATE TABLE IF NOT EXISTS public.booking_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (booking_id, service_id)
);

ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view booking services" ON public.booking_services;
CREATE POLICY "Anyone can view booking services"
  ON public.booking_services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create booking services" ON public.booking_services;
CREATE POLICY "Anyone can create booking services"
  ON public.booking_services FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update booking services" ON public.booking_services;
CREATE POLICY "Anyone can update booking services"
  ON public.booking_services FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete booking services" ON public.booking_services;
CREATE POLICY "Anyone can delete booking services"
  ON public.booking_services FOR DELETE USING (true);

-- Backfill for existing rows where each booking had a single service.
INSERT INTO public.booking_services (booking_id, service_id)
SELECT b.id, b.service_id
FROM public.bookings b
LEFT JOIN public.booking_services bs
  ON bs.booking_id = b.id
 AND bs.service_id = b.service_id
WHERE bs.id IS NULL;