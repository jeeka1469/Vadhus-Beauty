import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Service } from '@/lib/types'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
      <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
        <span className="font-sans text-4xl text-primary/30">{service.category.charAt(0)}</span>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
            {service.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {service.duration} min
          </span>
        </div>
        
        <h3 className="font-sans text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {service.name}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="font-sans text-2xl font-semibold text-primary">
            ₹{service.price.toLocaleString()}
          </div>
          <Button asChild size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Link href={`/booking?service=${service.id}`} className="flex items-center gap-2">
              Book <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
