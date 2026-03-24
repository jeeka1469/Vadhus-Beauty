import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, DollarSign, Users, Clock } from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  
  // Get today's bookings
  const { count: todayBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('booking_date', today)

  // Get pending bookings
  const { count: pendingBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Get total revenue from paid invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('total')
    .eq('status', 'paid')
  
  const totalRevenue = invoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0

  // Get total services
  const { count: totalServices } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return {
    todayBookings: todayBookings || 0,
    pendingBookings: pendingBookings || 0,
    totalRevenue,
    totalServices: totalServices || 0,
  }
}

async function getRecentBookings() {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(name, price)
    `)
    .order('created_at', { ascending: false })
    .limit(5)
  
  return data || []
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentBookings = await getRecentBookings()

  const statCards = [
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Services',
      value: stats.totalServices,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans text-3xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to Vadhus Beauty admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-sans">Recent Bookings</CardTitle>
          <Link 
            href="/admin/bookings"
            className="text-sm text-primary hover:underline"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{booking.client_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.client_phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p>{booking.service?.name}</p>
                        <p className="text-sm text-muted-foreground">₹{booking.service?.price}</p>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4">{booking.booking_time}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No bookings yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
