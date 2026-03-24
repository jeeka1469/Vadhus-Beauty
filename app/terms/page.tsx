import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-sans text-4xl font-semibold text-foreground">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">
          By booking with Vadhus Beauty, you agree to provide accurate contact details and appointment information.
          Service availability, pricing, and booking times are subject to confirmation.
        </p>
        <p className="mt-4 text-muted-foreground">
          Invoices and reminders are issued based on booking records. For corrections or disputes,
          contact vadhusbeauty@gmail.com.
        </p>
      </section>
      <Footer />
    </main>
  )
}
