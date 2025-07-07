import { getSystemHealth } from '../../actions/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sports-tracker/ui/components/card'
import { Badge } from '@sports-tracker/ui/components/badge'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'

export async function SystemHealth() {
  const health = await getSystemHealth()

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>API sync status by sport</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {health.map((item) => (
            <div key={item.sportId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.status === 'healthy' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <p className="font-medium">{item.sportName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.lastSync ? (
                      <>
                        <Clock className="inline h-3 w-3 mr-1" />
                        Last sync: {formatDistanceToNow(new Date(item.lastSync), { addSuffix: true })}
                      </>
                    ) : (
                      'Never synced'
                    )}
                  </p>
                </div>
              </div>
              <Badge variant={item.status === 'healthy' ? 'secondary' : 'outline'}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}