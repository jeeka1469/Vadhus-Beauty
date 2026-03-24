'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, MessageSquareWarning } from 'lucide-react'

interface InvoiceActionsProps {
  invoiceId: string
}

export function InvoiceActions({ invoiceId }: InvoiceActionsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSendingReminder, setIsSendingReminder] = useState(false)

  const markAsPaid = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'paid',
          payment_method: 'cash',
        }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating invoice:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const sendReminder = async () => {
    setIsSendingReminder(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/send-reminder`, {
        method: 'POST',
      })

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string }
        alert(payload.error || 'Failed to send reminder')
        return
      }

      alert('Reminder sent successfully')
      router.refresh()
    } catch (error) {
      console.error('Error sending reminder:', error)
      alert('Failed to send reminder')
    } finally {
      setIsSendingReminder(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={sendReminder} disabled={isSendingReminder || isUpdating}>
        <MessageSquareWarning className="h-4 w-4 mr-2" />
        {isSendingReminder ? 'Sending...' : 'Send Reminder'}
      </Button>
      <Button onClick={markAsPaid} disabled={isUpdating || isSendingReminder}>
        <CheckCircle className="h-4 w-4 mr-2" />
        {isUpdating ? 'Updating...' : 'Mark as Paid'}
      </Button>
    </div>
  )
}
