'use client'

import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@sports-tracker/ui'
import { cn } from '@sports-tracker/ui'
import { useUserPreferences } from '../../stores/user-preferences'
import { useEventResults } from '../../hooks'
import type { Database } from '@sports-tracker/types'

interface EventResultsProps {
  eventId: string
  eventTitle?: string
  showTitle?: boolean
}

export function EventResults({ eventId, eventTitle, showTitle = true }: EventResultsProps) {
  const { preferences } = useUserPreferences()
  const { data: results, isLoading, error } = useEventResults(eventId)
  const [isRevealed, setIsRevealed] = useState(false)
  
  // Reset revealed state when no-spoiler mode is toggled
  useEffect(() => {
    if (preferences.noSpoilerMode) {
      setIsRevealed(false)
    }
  }, [preferences.noSpoilerMode])
  
  const shouldHideResults = preferences.noSpoilerMode && !isRevealed
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading results...</p>
        </CardContent>
      </Card>
    )
  }
  
  if (error || !results || results.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            {error ? 'Failed to load results' : 'No results available'}
          </p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle>Results{eventTitle && `: ${eventTitle}`}</CardTitle>
          {shouldHideResults && (
            <CardDescription>Click to reveal results</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="relative">
        <div className={cn(
          'space-y-2',
          shouldHideResults && 'blur-sm select-none pointer-events-none'
        )}>
          {results.map((result, index) => (
            <div
              key={result.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg',
                'bg-muted/50 hover:bg-muted transition-colors',
                index === 0 && 'bg-yellow-500/10 hover:bg-yellow-500/20',
                index === 1 && 'bg-gray-500/10 hover:bg-gray-500/20',
                index === 2 && 'bg-orange-500/10 hover:bg-orange-500/20'
              )}
            >
              <div className="flex items-center space-x-4">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  index === 0 && 'bg-yellow-500 text-white',
                  index === 1 && 'bg-gray-500 text-white',
                  index === 2 && 'bg-orange-500 text-white',
                  index > 2 && 'bg-muted-foreground/20 text-muted-foreground'
                )}>
                  {result.position}
                </div>
                <div>
                  <p className="font-medium">
                    {result.participant_name || result.team?.name || 'Unknown'}
                  </p>
                  {result.team && (
                    <p className="text-sm text-muted-foreground">
                      {result.team.short_name || result.team.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {result.time && (
                  <span className="text-sm font-mono">{result.time}</span>
                )}
                {result.points !== null && (
                  <Badge variant="secondary">{result.points} pts</Badge>
                )}
                {result.status && (
                  <Badge variant={result.status === 'DNF' ? 'destructive' : 'outline'}>
                    {result.status}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {shouldHideResults && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer backdrop-blur-sm bg-background/20 rounded-lg"
            onClick={() => setIsRevealed(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsRevealed(true)
              }
            }}
            aria-label="Click to reveal results"
          >
            <div className="flex flex-col items-center space-y-2">
              <Eye className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Click to reveal results</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}