import { getDashboardStats } from '../../actions/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@sports-tracker/ui/components/card'
import { Calendar, Trophy, Eye, Activity } from 'lucide-react'

export async function DashboardStats() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: 'Active Reminders',
      value: stats.totalReminders,
      icon: Calendar,
      description: 'Total reminders set',
      color: 'text-blue-600',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Activity,
      description: 'Next 7 days',
      color: 'text-green-600',
    },
    {
      title: 'Watched Sports',
      value: stats.watchedSports,
      icon: Eye,
      description: 'Sports you follow',
      color: 'text-purple-600',
    },
    {
      title: 'This Month',
      value: stats.monthlyEvents,
      icon: Trophy,
      description: 'Events tracked',
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
              <div className="text-2xl font-bold">{stat.value}</div>
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