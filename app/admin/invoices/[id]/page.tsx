import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react'
import { InvoiceActions } from '@/components/admin/invoice-actions'

interface InvoicePageProps {
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
    console.error('Error fetching invoice:', error)
    return null
  }

  return data
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params
  const invoice = await getInvoice(id)

  if (!invoice) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/invoices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="font-sans text-3xl font-semibold text-foreground">
              Invoice #{invoice.invoice_number}
            </h1>
            <p className="text-muted-foreground mt-1">
              Created on {new Date(invoice.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/admin/invoices/${invoice.id}/print`}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Link>
          </Button>
          {invoice.status === 'unpaid' && (
            <InvoiceActions invoiceId={invoice.id} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8 pb-8 border-b border-border">
                <div>
                  <h2 className="font-sans text-2xl font-semibold text-foreground">Vadhus Beauty</h2>
                  <p className="text-muted-foreground mt-1">Premium Salon</p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>104 A Wing, Ram Kutir Residency, Asalpha</p>
                    <p>Mumbai, Maharashtra 400053</p>
                    <p>Phone: +91 7506528283</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'unpaid' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status === 'paid' && <CheckCircle className="h-4 w-4 mr-1.5" />}
                    {invoice.status.toUpperCase()}
                  </div>
                  <p className="text-2xl font-mono font-semibold mt-4">
                    #{invoice.invoice_number}
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Bill To
                </h3>
                <p className="font-semibold text-lg">{invoice.booking?.client_name}</p>
                <p className="text-muted-foreground">{invoice.booking?.client_phone}</p>
                {invoice.booking?.client_email && (
                  <p className="text-muted-foreground">{invoice.booking?.client_email}</p>
                )}
              </div>

              {/* Service Details */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Service Details
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Service</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-right py-3 text-sm font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-4">
                        <p className="font-medium">{invoice.booking?.service?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {invoice.booking?.service?.duration} mins
                        </p>
                      </td>
                      <td className="py-4">
                        {new Date(invoice.booking?.booking_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        <br />
                        <span className="text-sm text-muted-foreground">{invoice.booking?.booking_time}</span>
                      </td>
                      <td className="py-4 text-right">₹{Number(invoice.amount).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-6">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{Number(invoice.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (GST)</span>
                      <span>₹{Number(invoice.tax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-xl border-t border-border pt-2 mt-2">
                      <span>Total</span>
                      <span>₹{Number(invoice.total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">Payment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{invoice.status}</p>
              </div>
              {invoice.payment_method && (
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">{invoice.payment_method.replace('_', ' ')}</p>
                </div>
              )}
              {invoice.paid_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Paid On</p>
                  <p className="font-medium">
                    {new Date(invoice.paid_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
