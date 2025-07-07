import { getUpcomingEvents } from '../../actions/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sports-tracker/ui/components/card'
import { Calendar, MapPin, Bell } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@sports-tracker/ui/components/button'

export async function UpcomingEvents() {
  const events = await getUpcomingEvents()

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your next events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No upcoming events found
            </p>
            <Button asChild className="mt-4">
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Your next events based on sport preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => {
            const hasReminder = event.reminders && event.reminders.length > 0
            
            return (
              <Link
                key={event.id}
                href={`/events/${event.sports.slug}/${event.id}`}
                className="block"
              >
                <div className="flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
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
                  {hasReminder && (
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/events">View All Events</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}