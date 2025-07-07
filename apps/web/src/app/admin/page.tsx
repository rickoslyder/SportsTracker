import { AdminStats } from '../../components/admin/admin-stats'
import { RecentEvents } from '../../components/admin/recent-events'
import { SystemHealth } from '../../components/admin/system-health'

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your sports tracking platform</p>
      </div>

      <div className="space-y-8">
        <AdminStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentEvents />
          <SystemHealth />
        </div>
      </div>
    </div>
  )
}