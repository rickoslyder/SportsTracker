'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@sports-tracker/ui/components/table'
import { Button } from '@sports-tracker/ui/components/button'
import { Badge } from '@sports-tracker/ui/components/badge'
import { Input } from '@sports-tracker/ui/components/input'
import { Select } from '@sports-tracker/ui/components/select'
import { format } from 'date-fns'
import { Search, Edit, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteEvent, bulkUpdateEventStatus } from '../../actions/admin'

interface Event {
  id: number
  name: string
  sport_id: number
  start_time: string
  location: string | null
  status: string
  sports: {
    name: string
    slug: string
  }
}

export function EventsDataTable() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedEvents, setSelectedEvents] = useState<number[]>([])

  const supabase = createClient()

  const fetchEvents = async () => {
    setLoading(true)
    
    let query = supabase
      .from('events')
      .select(`
        id,
        name,
        sport_id,
        start_time,
        location,
        status,
        sports(name, slug)
      `)
      .order('start_time', { ascending: false })
      .limit(100)

    if (sportFilter !== 'all') {
      query = query.eq('sport_id', parseInt(sportFilter))
    }

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      toast.error('Failed to fetch events')
      console.error(error)
    } else {
      setEvents(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [sportFilter, statusFilter])

  const handleDelete = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      await deleteEvent(eventId)
      toast.success('Event deleted successfully')
      fetchEvents()
    } catch (error) {
      toast.error('Failed to delete event')
    }
  }

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedEvents.length === 0) {
      toast.error('No events selected')
      return
    }

    try {
      await bulkUpdateEventStatus(selectedEvents, status as any)
      toast.success(`${selectedEvents.length} events updated`)
      setSelectedEvents([])
      fetchEvents()
    } catch (error) {
      toast.error('Failed to update events')
    }
  }

  const toggleEventSelection = (eventId: number) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  const toggleAllEvents = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([])
    } else {
      setSelectedEvents(events.map(e => e.id))
    }
  }

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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchEvents()}
              className="pl-10"
            />
          </div>
          
          <Select
            value={sportFilter}
            onValueChange={setSportFilter}
          >
            <option value="all">All Sports</option>
            <option value="1">Formula 1</option>
            <option value="2">Formula E</option>
            <option value="3">MotoGP</option>
            <option value="4">UFC</option>
            <option value="5">WWE</option>
            <option value="6">Boxing</option>
            <option value="7">IndyCar</option>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>

        {selectedEvents.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedEvents.length} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('completed')}
            >
              Mark Completed
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('cancelled')}
            >
              Mark Cancelled
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedEvents.length === events.length && events.length > 0}
                    onChange={toggleAllEvents}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => toggleEventSelection(event.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{event.sports.name}</TableCell>
                  <TableCell>
                    {format(new Date(event.start_time), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell>{event.location || '-'}</TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          toast.info('Edit functionality coming soon')
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}