import { Suspense } from 'react'
import { DashboardStats } from '../../components/dashboard/dashboard-stats'
import { UpcomingEvents } from '../../components/dashboard/upcoming-events'
import { EventChart } from '../../components/dashboard/event-chart'
import { RecentActivity } from '../../components/dashboard/recent-activity'
import { FavoriteSports } from '../../components/dashboard/favorite-sports'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
          <EventChart />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
          <FavoriteSports />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
          <UpcomingEvents />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
          <RecentActivity />
        </Suspense>
      </div>
    </div>
  )
}