import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant'
})

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: 'Vadhus Beauty | Premium Beauty Salon',
  description: 'Experience luxury beauty services at Vadhus Beauty. Hair styling, makeup, nails, facials, and spa treatments by expert professionals.',
  keywords: ['beauty salon', 'hair styling', 'makeup', 'nails', 'spa', 'facial', 'bridal makeup'],
  openGraph: {
    title: 'Vadhus Beauty | Premium Beauty Salon',
    description: 'Experience luxury beauty services at Vadhus Beauty',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#8ab9f2',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${montserrat.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
