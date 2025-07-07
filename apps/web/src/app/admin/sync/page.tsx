import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { SyncDashboard } from '../../../components/admin/sync-dashboard'

export default async function AdminSyncPage() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  // TODO: Add admin role check
  // For now, any authenticated user can access
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">API Sync Management</h1>
        <p className="text-muted-foreground">Monitor and manage external data synchronization</p>
      </div>
      
      <SyncDashboard />
    </div>
  )
}