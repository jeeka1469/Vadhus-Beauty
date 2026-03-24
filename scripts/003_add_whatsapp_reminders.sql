-- Add reminder tracking fields to invoices
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_reminder_at TIMESTAMPTZ;

-- Reminder log table
CREATE TABLE IF NOT EXISTS public.invoice_reminders_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  sent_to TEXT,
  message_template TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  provider_message_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invoice_reminders_log_invoice_id_idx
  ON public.invoice_reminders_log(invoice_id);

CREATE INDEX IF NOT EXISTS invoice_reminders_log_created_at_idx
  ON public.invoice_reminders_log(created_at DESC);

ALTER TABLE public.invoice_reminders_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view invoice reminders log" ON public.invoice_reminders_log;
CREATE POLICY "Anyone can view invoice reminders log"
  ON public.invoice_reminders_log FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert invoice reminders log" ON public.invoice_reminders_log;
CREATE POLICY "Anyone can insert invoice reminders log"
  ON public.invoice_reminders_log FOR INSERT WITH CHECK (true);
