'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SERVICE_CATEGORIES } from '@/lib/types'
import {
  Scissors,
  Sparkles,
  Heart,
  Flower2,
  Brush,
  CircleDot,
  Box,
} from 'lucide-react'

const categoryIcons = {
  Facial: Heart,
  Wax: CircleDot,
  Nails: Sparkles,
  'Hair Treatment': Scissors,
  Colour: Brush,
  'Hair Cut': Scissors,
  Spa: Flower2,
  Others: CircleDot,
  Essentials: Box,
}

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  const handleCategoryChange = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    router.push(`/services?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={() => handleCategoryChange(null)}
        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
          !activeCategory
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-card text-foreground border border-border hover:border-primary/50'
        }`}
      >
        All Services
      </button>
      
      {SERVICE_CATEGORIES.map((category) => {
        const Icon = categoryIcons[category]
        return (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card text-foreground border border-border hover:border-primary/50'
            }`}
          >
            <Icon className="h-4 w-4" />
            {category}
          </button>
        )
      })}
    </div>
  )
}
