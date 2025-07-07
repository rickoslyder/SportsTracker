import { requireAdmin } from '../../middleware/admin'
import { AdminSidebar } from '../../components/admin/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-muted/10">
        {children}
      </main>
    </div>
  )
}