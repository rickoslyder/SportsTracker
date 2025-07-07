import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sports-tracker/ui'
import { getEvent } from '../../actions/events'
import { EventResults } from '../../../components/events/event-results'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { ReminderButton } from '../../../components/reminders/reminder-button'

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(params.id)
  
  if (!event) {
    notFound()
  }
  
  const eventDate = new Date(event.start_time)
  const isUpcoming = event.status === 'scheduled' && eventDate > new Date()
  const isLive = event.status === 'live'
  const isFinished = event.status === 'finished'
  
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Event Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant="outline"
              className="text-lg py-1 px-3"
              style={{ borderColor: event.sport.color, color: event.sport.color }}
            >
              {event.sport.name}
            </Badge>
            <Badge
              variant={isLive ? 'destructive' : isUpcoming ? 'default' : 'secondary'}
              className={isLive ? 'animate-pulse' : ''}
            >
              {isLive ? 'LIVE' : event.status.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          {event.description && (
            <p className="text-lg text-muted-foreground">{event.description}</p>
          )}
          {isUpcoming && (
            <div className="mt-4">
              <ReminderButton event={event} size="default" />
            </div>
          )}
        </div>
        
        {/* Event Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(eventDate, 'EEEE, MMMM do, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{format(eventDate, 'h:mm a zzz')}</span>
            </div>
            {event.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.venue}</span>
              </div>
            )}
            {event.league && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">League/Series</p>
                  <p className="font-medium">{event.league}</p>
                </div>
                {event.session_type && (
                  <div>
                    <p className="text-sm text-muted-foreground">Session</p>
                    <p className="font-medium">{event.session_type}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Participants/Teams */}
        {event.teams && event.teams.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.teams.map((et: any) => (
                  <div key={et.team.id} className="flex items-center gap-3">
                    {et.team.logo_url && (
                      <img
                        src={et.team.logo_url}
                        alt={et.team.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div>
                      <p className="font-medium">{et.team.name}</p>
                      {et.team.driver_name && (
                        <p className="text-sm text-muted-foreground">{et.team.driver_name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Results */}
        {isFinished && (
          <EventResults eventId={event.id} showTitle={true} />
        )}
        
        {/* Additional Information */}
        {event.metadata && Object.keys(event.metadata).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: EventPageProps) {
  const event = await getEvent(params.id)
  
  if (!event) {
    return {
      title: 'Event Not Found',
    }
  }
  
  return {
    title: `${event.title} - ${event.sport.name}`,
    description: event.description || `${event.sport.name} event at ${event.venue}`,
  }
}