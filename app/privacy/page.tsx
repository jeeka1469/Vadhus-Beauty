import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-sans text-4xl font-semibold text-foreground">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          We collect only the information needed to provide bookings, invoicing, and customer support.
          Your contact and appointment details are used for service delivery and reminders.
        </p>
        <p className="mt-4 text-muted-foreground">
          We do not sell personal data. Access to admin records is protected and limited to authorized staff.
          For privacy concerns, contact vadhusbeauty@gmail.com.
        </p>
      </section>
      <Footer />
    </main>
  )
}
