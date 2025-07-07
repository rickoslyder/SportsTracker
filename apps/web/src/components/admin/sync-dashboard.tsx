'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sports-tracker/ui/components/card'
import { Button } from '@sports-tracker/ui/components/button'
import { Badge } from '@sports-tracker/ui/components/badge'
import { RefreshCw, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface SyncStatus {
  sportId: number
  name: string
  enabled: boolean
  schedule: string
  lastRun: string | null
  isRunning: boolean
  eventCount: number
}

export function SyncDashboard() {
  const [statuses, setStatuses] = useState<SyncStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<number | null>(null)

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sync/status`)
      const data = await response.json()
      setStatuses(data.statuses)
    } catch (error) {
      console.error('Failed to fetch sync statuses:', error)
      toast.error('Failed to fetch sync statuses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatuses()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatuses, 30000)
    return () => clearInterval(interval)
  }, [])

  const triggerSync = async (sportId: number, sportName: string) => {
    setSyncing(sportId)
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sync/trigger/${sportId}`,
        { method: 'POST' }
      )
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to trigger sync')
      }
      
      toast.success(`Sync triggered for ${sportName}`)
      
      // Refresh statuses after a delay
      setTimeout(fetchStatuses, 2000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to trigger sync')
    } finally {
      setSyncing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Sync Status</h2>
        <Button onClick={fetchStatuses} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {statuses.map((status) => (
          <Card key={status.sportId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{status.name}</CardTitle>
                  <CardDescription>
                    Schedule: {status.schedule} • {status.eventCount} events
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {status.isRunning ? (
                    <Badge variant="default" className="animate-pulse">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Syncing
                    </Badge>
                  ) : status.enabled ? (
                    <Badge variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Disabled
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Last run: {
                      status.lastRun 
                        ? formatDistanceToNow(new Date(status.lastRun), { addSuffix: true })
                        : 'Never'
                    }
                  </span>
                </div>
                <Button
                  onClick={() => triggerSync(status.sportId, status.name)}
                  disabled={status.isRunning || syncing === status.sportId || !status.enabled}
                  size="sm"
                >
                  {syncing === status.sportId ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Triggering...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}