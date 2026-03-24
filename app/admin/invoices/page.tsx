import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Download, Eye } from 'lucide-react'

async function getInvoices() {
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
        service:services(name)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching invoices:', error)
    return []
  }

  return data || []
}

export default async function InvoicesPage() {
  const invoices = await getInvoices()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'unpaid': return 'bg-amber-100 text-amber-800'
      case 'refunded': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sans text-3xl font-semibold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage billing and payments</p>
        </div>
        <Button asChild>
          <Link href="/admin/invoices/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice #</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-4 px-4 font-mono text-sm">
                        {invoice.invoice_number}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium">{invoice.booking?.client_name}</p>
                        <p className="text-sm text-muted-foreground">{invoice.booking?.client_phone}</p>
                      </td>
                      <td className="py-4 px-4">
                        {invoice.booking?.service?.name}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold">₹{Number(invoice.total).toLocaleString()}</p>
                        {Number(invoice.tax) > 0 && (
                          <p className="text-xs text-muted-foreground">
                            incl. ₹{Number(invoice.tax).toLocaleString()} tax
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/invoices/${invoice.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/invoices/${invoice.id}/print`}>
                              <Download className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">No invoices yet</p>
              <Button asChild variant="outline">
                <Link href="/admin/invoices/create">Create your first invoice</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
