'use client'

import { Button } from '@sports-tracker/ui'
import { Badge } from '@sports-tracker/ui'
import { useUIStore } from '../../stores/ui'
import { useSports } from '../../hooks/use-sports'
import { format } from 'date-fns'
import { Calendar, Filter, X } from 'lucide-react'

export function EventsFilter() {
  const { data: sports } = useSports()
  const { eventFilters, setEventFilters, resetEventFilters } = useUIStore()
  
  const selectedSportsCount = eventFilters.sports.length
  const hasActiveFilters = 
    selectedSportsCount > 0 ||
    eventFilters.dateRange.start !== null ||
    eventFilters.dateRange.end !== null ||
    eventFilters.status.length > 0 ||
    eventFilters.search !== ''
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetEventFilters}
            className="h-8 px-2 text-xs"
          >
            Clear all
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Sports Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Sports</label>
        <div className="flex flex-wrap gap-2">
          {sports?.map((sport) => {
            const isSelected = eventFilters.sports.includes(sport.slug)
            return (
              <Badge
                key={sport.id}
                variant={isSelected ? 'default' : 'outline'}
                className="cursor-pointer hover:opacity-80"
                style={isSelected ? { backgroundColor: sport.color, borderColor: sport.color } : { borderColor: sport.color, color: sport.color }}
                onClick={() => {
                  const newSports = isSelected
                    ? eventFilters.sports.filter((s) => s !== sport.slug)
                    : [...eventFilters.sports, sport.slug]
                  setEventFilters({ sports: newSports })
                }}
              >
                {sport.name}
              </Badge>
            )
          })}
        </div>
      </div>
      
      {/* Status Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <div className="flex flex-wrap gap-2">
          {['scheduled', 'live', 'finished', 'cancelled', 'postponed'].map((status) => {
            const isSelected = eventFilters.status.includes(status)
            return (
              <Badge
                key={status}
                variant={isSelected ? 'default' : 'outline'}
                className="cursor-pointer hover:opacity-80 capitalize"
                onClick={() => {
                  const newStatus = isSelected
                    ? eventFilters.status.filter((s) => s !== status)
                    : [...eventFilters.status, status]
                  setEventFilters({ status: newStatus })
                }}
              >
                {status}
              </Badge>
            )
          })}
        </div>
      </div>
      
      {/* Date Range */}
      <div>
        <label className="text-sm font-medium mb-2 block">Date Range</label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              setEventFilters({ dateRange: { start: today, end: eventFilters.dateRange.end } })
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {eventFilters.dateRange.start
              ? format(eventFilters.dateRange.start, 'PP')
              : 'Start date'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const endDate = new Date()
              endDate.setMonth(endDate.getMonth() + 1)
              endDate.setHours(23, 59, 59, 999)
              setEventFilters({ dateRange: { start: eventFilters.dateRange.start, end: endDate } })
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {eventFilters.dateRange.end
              ? format(eventFilters.dateRange.end, 'PP')
              : 'End date'}
          </Button>
          {(eventFilters.dateRange.start || eventFilters.dateRange.end) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEventFilters({ dateRange: { start: null, end: null } })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              {selectedSportsCount > 0 && `${selectedSportsCount} sport${selectedSportsCount > 1 ? 's' : ''}`}
              {eventFilters.status.length > 0 && (selectedSportsCount > 0 ? ', ' : '') + `${eventFilters.status.length} status${eventFilters.status.length > 1 ? 'es' : ''}`}
              {eventFilters.dateRange.start && ((selectedSportsCount > 0 || eventFilters.status.length > 0) ? ', ' : '') + 'date range'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}