import { getRecentEvents } from '../../actions/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sports-tracker/ui/components/card'
import { Badge } from '@sports-tracker/ui/components/badge'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@sports-tracker/ui/components/button'
import { Calendar, MapPin } from 'lucide-react'

export async function RecentEvents() {
  const events = await getRecentEvents()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>
      case 'live':
        return <Badge variant="default">Live</Badge>
      case 'completed':
        return <Badge variant="outline">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
        <CardDescription>Latest events added to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start justify-between space-x-4">
              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">{event.name}</p>
                <p className="text-sm text-muted-foreground">
                  {event.sports.name}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(event.start_time), 'MMM d, h:mm a')}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(event.status)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/events">View All Events</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}