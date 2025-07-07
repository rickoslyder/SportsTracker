'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEvents } from '../../hooks'
import { EventCard } from '../../components/events/event-card'
import { EventsFilter } from '../../components/events/events-filter'
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sports-tracker/ui'
import { 
  Loader2, 
  Grid3x3, 
  List, 
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  CalendarDays
} from 'lucide-react'
import { GradientText } from '../../components/common/gradient-text'
import { EventCardSkeleton } from '../../components/common/loading-skeleton'
import { cn } from '@sports-tracker/ui'

type ViewMode = 'grid' | 'list' | 'calendar'
type SortOption = 'date-asc' | 'date-desc' | 'sport' | 'popularity'

const sortOptions = [
  { value: 'date-asc', label: 'Date (Upcoming first)' },
  { value: 'date-desc', label: 'Date (Latest first)' },
  { value: 'sport', label: 'Sport' },
  { value: 'popularity', label: 'Most Popular' }
]

export default function EventsPageEnhanced() {
  const [page, setPage] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<SortOption>('date-asc')
  const [showFilters, setShowFilters] = useState(true)
  const limit = viewMode === 'grid' ? 12 : 20
  
  const { data: events, isLoading, isFetching, error } = useEvents({
    limit,
    offset: page * limit,
  })
  
  const hasMore = events && events.length === limit
  const totalPages = 10 // This would come from API in real app
  
  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load events</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Upcoming <GradientText gradient="sport">Sports Events</GradientText>
        </h1>
        <p className="text-xl text-muted-foreground">
          Track and never miss your favorite sports events
        </p>
      </motion.div>
      
      {/* Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-muted/30 rounded-lg"
      >
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              onClick={() => setViewMode('calendar')}
              className="px-3"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-sm text-muted-foreground">
            Showing {events?.length || 0} events
          </div>
        </div>
      </motion.div>
      
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            'space-y-6',
            !showFilters && 'hidden lg:block'
          )}
        >
          <div className="sticky top-4">
            <EventsFilter />
            
            {/* Quick Date Filters */}
            <div className="mt-6 p-4 rounded-lg border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Quick Filters
              </h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Today
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  This Weekend
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Next 7 Days
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  This Month
                </Button>
              </div>
            </div>
          </div>
        </motion.aside>
        
        {/* Events Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {isLoading && page === 0 ? (
            <div className={cn(
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            )}>
              {Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : viewMode === 'calendar' ? (
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Calendar View Coming Soon</h3>
              <p className="text-muted-foreground">
                We're working on a beautiful calendar view for easier event planning
              </p>
            </div>
          ) : events && events.length > 0 ? (
            <>
              <div className={cn(
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              )}>
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
              
              {/* Enhanced Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(0)}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-3" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = i
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum + 1}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(totalPages - 1)}
                        className="w-10"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={!hasMore || isFetching}
                  >
                    {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(totalPages - 1)}
                    disabled={!hasMore}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-3" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No events found matching your filters</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reset filters
              </Button>
            </motion.div>
          )}
        </motion.main>
      </div>
    </div>
  )
}