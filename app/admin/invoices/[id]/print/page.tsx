import { createClient } from '@/lib/supabase/server'
import { PrintInvoiceButton } from '@/components/admin/print-invoice-button'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface PrintInvoicePageProps {
  params: Promise<{ id: string }>
}

async function getInvoice(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      booking:bookings(
        id,
        client_name,
        client_phone,
        client_email,
        booking_date,
        booking_time,
        service:services(name, price, duration)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    return null
  }

  return data
}

export async function generateMetadata({ params }: PrintInvoicePageProps): Promise<Metadata> {
  const { id } = await params
  const invoice = await getInvoice(id)

  if (!invoice) {
    return {
      title: 'Invoice Not Found',
    }
  }

  return {
    title: `Invoice #${invoice.invoice_number} - Vadhus Beauty`,
  }
}

export default async function PrintInvoicePage({ params }: PrintInvoicePageProps) {
  const { id } = await params
  const invoice = await getInvoice(id)

  if (!invoice) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-[800px] bg-white p-6 text-[#333] print:max-w-none print:p-0">
      <PrintInvoiceButton />

      <div className="mb-8 flex items-start justify-between border-b-2 border-[#b8d8ff] pb-5">
        <div>
          <h1 className="m-0 text-3xl font-semibold text-[#4a8fe0]">Vadhus Beauty</h1>
          <p className="mt-1 text-sm text-[#666]">Premium Salon</p>
          <div className="mt-4 text-sm text-[#666]">
            <p className="m-0">104 A Wing, Ram Kutir Residency, Asalpha</p>
            <p className="m-0">Mumbai, Maharashtra 400053</p>
            <p className="m-0">Phone: +91 7506528283</p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-mono text-2xl font-bold">#{invoice.invoice_number}</p>
          <p className="mt-2 text-sm text-[#666]">
            {new Date(invoice.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <span
            className={`mt-3 inline-block rounded-full px-4 py-1 text-xs font-semibold uppercase ${
              invoice.status === 'paid'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {invoice.status}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-2 text-xs uppercase tracking-widest text-[#666]">Bill To</p>
        <p className="text-lg font-semibold">{invoice.booking?.client_name}</p>
        <p className="text-[#666]">{invoice.booking?.client_phone}</p>
        {invoice.booking?.client_email && (
          <p className="text-[#666]">{invoice.booking?.client_email}</p>
        )}
      </div>

      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-widest text-[#666]">Service Details</p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <th className="px-3 py-3 text-left text-xs uppercase text-[#666]">Service</th>
                <th className="px-3 py-3 text-left text-xs uppercase text-[#666]">Date</th>
                <th className="px-3 py-3 text-right text-xs uppercase text-[#666]">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#e5e7eb]">
                <td className="px-3 py-4">
                  <p className="font-semibold">{invoice.booking?.service?.name}</p>
                  <p className="text-sm text-[#666]">
                    Duration: {invoice.booking?.service?.duration} mins
                  </p>
                </td>
                <td className="px-3 py-4">
                  <p>
                    {new Date(invoice.booking?.booking_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-[#666]">{invoice.booking?.booking_time}</p>
                </td>
                <td className="px-3 py-4 text-right">₹{Number(invoice.amount).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-[250px]">
            <div className="flex justify-between py-2">
              <span className="text-[#666]">Subtotal</span>
              <span>₹{Number(invoice.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#666]">Tax (GST)</span>
              <span>₹{Number(invoice.tax).toLocaleString()}</span>
            </div>
            <div className="mt-2 flex justify-between border-t-2 border-[#333] pt-3 text-xl font-bold">
              <span>Total</span>
              <span>₹{Number(invoice.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[#e5e7eb] pt-5 text-center text-sm text-[#666]">
        <p>Thank you for choosing Vadhus Beauty!</p>
        <p className="mt-2">For any queries, contact us at hello@vadhusbeauty.com</p>
      </div>
    </div>
  )
}
