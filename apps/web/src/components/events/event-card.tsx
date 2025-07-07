'use client'

import { format, formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sports-tracker/ui'
import { Badge } from '@sports-tracker/ui'
import { cn } from '@sports-tracker/ui'
import { Database } from '@sports-tracker/types'
import Link from 'next/link'
import { Trophy, EyeOff } from 'lucide-react'
import { useUserPreferences } from '../../stores/user-preferences'
import { useEventResults } from '../../hooks'
import { ReminderButton } from '../reminders/reminder-button'

type Event = Database['public']['Tables']['events']['Row'] & {
  sport: Database['public']['Tables']['sports']['Row']
}

interface EventCardProps {
  event: Event
  showResults?: boolean
}

export function EventCard({ event, showResults = true }: EventCardProps) {
  const { preferences } = useUserPreferences()
  const { data: results } = useEventResults(event.id)
  const hideResults = preferences.noSpoilerMode && showResults && event.status === 'finished'
  
  const eventDate = new Date(event.start_time)
  const isUpcoming = event.status === 'scheduled' && eventDate > new Date()
  const isLive = event.status === 'live'
  const isFinished = event.status === 'finished'
  
  // Get winner info if results are available
  const winner = results && results.length > 0 ? results[0] : null
  const hasResults = isFinished && winner
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link href={`/events/${event.id}`}>
        <CardHeader className="cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>
                {event.venue} • {format(eventDate, 'PPP')}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                variant="outline"
                style={{ borderColor: event.sport.color, color: event.sport.color }}
              >
                {event.sport.name}
              </Badge>
              <Badge
                variant={isLive ? 'destructive' : isUpcoming ? 'default' : 'secondary'}
                className={cn(isLive && 'animate-pulse')}
              >
                {isLive ? 'LIVE' : event.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {event.description && (
              <p className="text-sm text-muted-foreground">{event.description}</p>
            )}
            
            {hasResults && showResults && (
              <div className={cn(
                'relative rounded-lg p-3 bg-muted/50',
                hideResults && 'overflow-hidden'
              )}>
                <div className={cn(
                  'flex items-center space-x-2',
                  hideResults && 'blur-sm select-none'
                )}>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    Winner: {winner.participant_name || winner.team?.name || 'Unknown'}
                  </span>
                  {winner.time && (
                    <span className="text-sm text-muted-foreground">({winner.time})</span>
                  )}
                </div>
                {hideResults && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/10">
                    <div className="flex items-center space-x-1">
                      <EyeOff className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Hidden</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {isUpcoming ? (
                  <>Starts {formatDistanceToNow(eventDate, { addSuffix: true })}</>
                ) : (
                  <>Started {format(eventDate, 'p')}</>
                )}
              </span>
              
              {isFinished && hideResults && (
                <Badge variant="outline" className="bg-muted">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Results hidden
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
      {isUpcoming && (
        <div className="px-6 pb-4">
          <ReminderButton event={event} variant="outline" size="sm" className="w-full" />
        </div>
      )}
    </Card>
  )
}