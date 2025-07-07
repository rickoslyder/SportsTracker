import { getAdminStats } from '../../actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@sports-tracker/ui/components/card'
import { Calendar, Users, Bell, Activity } from 'lucide-react'

export async function AdminStats() {
  const stats = await getAdminStats()

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      description: 'Across all sports',
      color: 'text-blue-600',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered users',
      color: 'text-green-600',
    },
    {
      title: 'Active Reminders',
      value: stats.activeReminders,
      icon: Bell,
      description: 'System-wide',
      color: 'text-purple-600',
    },
    {
      title: 'Events This Week',
      value: stats.eventsThisWeek,
      icon: Activity,
      description: 'Upcoming events',
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}