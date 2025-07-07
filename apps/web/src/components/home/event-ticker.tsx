'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@sports-tracker/ui'
import { cn } from '@sports-tracker/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Trophy } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

// Mock data - in real app, this would come from the API
const mockLiveEvents = [
  {
    id: '1',
    title: 'Australian Grand Prix - Race',
    sport: { name: 'F1', color: '#e10600' },
    status: 'live',
    venue: 'Albert Park Circuit',
    currentLap: '45/58'
  },
  {
    id: '2',
    title: 'UFC 300 - Main Card',
    sport: { name: 'UFC', color: '#d20a0a' },
    status: 'live',
    venue: 'T-Mobile Arena',
    currentFight: 'Co-Main Event'
  },
  {
    id: '3',
    title: 'MotoGP Qatar - Qualifying',
    sport: { name: 'MotoGP', color: '#cc0000' },
    status: 'upcoming',
    venue: 'Losail Circuit',
    startsIn: '2 hours'
  }
]

export function EventTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [events] = useState(mockLiveEvents)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [events.length])

  const currentEvent = events[currentIndex]

  return (
    <div className="bg-card/50 backdrop-blur-sm border-y">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="animate-pulse">
              <Trophy className="h-3 w-3 mr-1" />
              LIVE NOW
            </Badge>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEvent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4"
              >
                <Link
                  href={`/events/${currentEvent.id}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Badge
                    variant="outline"
                    style={{ borderColor: currentEvent.sport.color, color: currentEvent.sport.color }}
                    className="font-semibold"
                  >
                    {currentEvent.sport.name}
                  </Badge>
                  
                  <span className="font-medium">{currentEvent.title}</span>
                  
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {currentEvent.venue}
                  </span>
                  
                  {currentEvent.status === 'live' && currentEvent.currentLap && (
                    <Badge variant="secondary" className="text-xs">
                      Lap {currentEvent.currentLap}
                    </Badge>
                  )}
                  
                  {currentEvent.status === 'live' && currentEvent.currentFight && (
                    <Badge variant="secondary" className="text-xs">
                      {currentEvent.currentFight}
                    </Badge>
                  )}
                  
                  {currentEvent.status === 'upcoming' && (
                    <span className="text-xs text-muted-foreground">
                      Starts in {currentEvent.startsIn}
                    </span>
                  )}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex items-center gap-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-primary w-6'
                    : 'bg-muted hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}