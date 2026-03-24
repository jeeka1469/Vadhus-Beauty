import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, IndianRupee } from 'lucide-react'
import type { Service } from '@/lib/types'

async function getServices(): Promise<Service[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('category')
    .order('name')

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data || []
}

export default async function AdminServicesPage() {
  const services = await getServices()
  
  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sans text-3xl font-semibold text-foreground">Services</h1>
          <p className="text-muted-foreground mt-1">Manage your service offerings</p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="font-sans">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryServices.map((service) => (
                      <tr key={service.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {service.description}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {service.duration} min
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="flex items-center gap-0.5 font-semibold">
                            <IndianRupee className="h-4 w-4" />
                            {service.price.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            service.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {service.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
