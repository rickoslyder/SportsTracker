'use client'

import { useState } from 'react'
import { Card, Button, Badge } from '@sports-tracker/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@sports-tracker/ui'
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

// Mock featured events - in real app, this would be curated content
const featuredEvents = [
  {
    id: '1',
    title: 'Monaco Grand Prix',
    sport: { name: 'F1', color: '#e10600' },
    date: new Date('2024-05-26T14:00:00'),
    venue: 'Circuit de Monaco',
    location: 'Monte Carlo, Monaco',
    image: 'https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?w=1200&h=600&fit=crop',
    description: 'The crown jewel of Formula 1 racing through the streets of Monaco'
  },
  {
    id: '2',
    title: 'UFC 301: Pantoja vs. Erceg',
    sport: { name: 'UFC', color: '#d20a0a' },
    date: new Date('2024-05-04T22:00:00'),
    venue: 'Farmasi Arena',
    location: 'Rio de Janeiro, Brazil',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200&h=600&fit=crop',
    description: 'Flyweight championship bout headlines a stacked fight card'
  },
  {
    id: '3',
    title: 'Italian MotoGP',
    sport: { name: 'MotoGP', color: '#cc0000' },
    date: new Date('2024-06-02T14:00:00'),
    venue: 'Autodromo del Mugello',
    location: 'Tuscany, Italy',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
    description: 'High-speed motorcycle racing at the legendary Mugello circuit'
  }
]

export function FeaturedEvents() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentEvent = featuredEvents[currentIndex]

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length)
  }

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length)
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't miss these upcoming marquee events
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-64 lg:h-full">
                    <img
                      src={currentEvent.image}
                      alt={currentEvent.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge
                      className="absolute top-4 left-4"
                      style={{ backgroundColor: currentEvent.sport.color }}
                    >
                      {currentEvent.sport.name}
                    </Badge>
                  </div>
                  
                  <div className="p-8 lg:p-12">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                      {currentEvent.title}
                    </h3>
                    
                    <p className="text-lg text-muted-foreground mb-6">
                      {currentEvent.description}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(currentEvent.date, 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{format(currentEvent.date, 'h:mm a zzz')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{currentEvent.venue}, {currentEvent.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button asChild>
                        <Link href={`/events/${currentEvent.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/events/${currentEvent.id}#reminder`}>
                          Set Reminder
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button
            onClick={prevEvent}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2',
              'p-2 rounded-full bg-background/80 backdrop-blur-sm',
              'border shadow-lg transition-all',
              'hover:bg-background hover:scale-110'
            )}
            aria-label="Previous event"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextEvent}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              'p-2 rounded-full bg-background/80 backdrop-blur-sm',
              'border shadow-lg transition-all',
              'hover:bg-background hover:scale-110'
            )}
            aria-label="Next event"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {featuredEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}