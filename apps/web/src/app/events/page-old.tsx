'use client'

import { useEvents } from '../../hooks'
import { EventCard } from '../../components/events/event-card'
import { EventsFilter } from '../../components/events/events-filter'
import { Button } from '@sports-tracker/ui'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function EventsPage() {
  const [page, setPage] = useState(0)
  const limit = 20
  
  const { data: events, isLoading, isFetching, error } = useEvents({
    limit,
    offset: page * limit,
  })
  
  const hasMore = events && events.length === limit
  
  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Events</h1>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load events. Please try again.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Events</h1>
      
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <EventsFilter />
        </aside>
        
        {/* Events List */}
        <main>
          {isLoading && page === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : events && events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Page {page + 1}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore || isFetching}
                >
                  {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found matching your filters.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Reset filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}