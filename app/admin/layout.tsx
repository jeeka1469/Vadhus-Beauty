import { getAdminAccessCookieName, isAdminAccessTokenValid } from '@/lib/admin-access'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(getAdminAccessCookieName())?.value
  const hasValidAccessCode = isAdminAccessTokenValid(accessToken)

  if (!hasValidAccessCode) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar userEmail="Admin" />
      <main className="flex-1 lg:pl-64">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
