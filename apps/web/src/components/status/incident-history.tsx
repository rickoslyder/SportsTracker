'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@sports-tracker/ui'
import { Badge } from '@sports-tracker/ui'
import { AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react'

const incidents = [
  {
    id: 1,
    title: 'Notification Delays',
    status: 'resolved',
    severity: 'minor',
    date: '2024-01-14',
    duration: '45 minutes',
    affectedServices: ['Notifications', 'Email Alerts'],
    timeline: [
      { time: '14:30', event: 'Issue detected - Email notifications experiencing delays', status: 'investigating' },
      { time: '14:45', event: 'Root cause identified - Email queue backlog', status: 'identified' },
      { time: '15:00', event: 'Fix implemented - Queue processing optimized', status: 'monitoring' },
      { time: '15:15', event: 'Issue resolved - All notifications delivered', status: 'resolved' }
    ]
  },
  {
    id: 2,
    title: 'API Response Time Degradation',
    status: 'resolved',
    severity: 'major',
    date: '2024-01-10',
    duration: '2 hours',
    affectedServices: ['API', 'Mobile Apps'],
    timeline: [
      { time: '09:00', event: 'Elevated API response times detected', status: 'investigating' },
      { time: '09:30', event: 'Database connection pool exhausted', status: 'identified' },
      { time: '10:15', event: 'Additional database connections provisioned', status: 'monitoring' },
      { time: '11:00', event: 'Performance back to normal', status: 'resolved' }
    ]
  },
  {
    id: 3,
    title: 'Calendar Sync Issues',
    status: 'resolved',
    severity: 'minor',
    date: '2024-01-05',
    duration: '30 minutes',
    affectedServices: ['Calendar Sync'],
    timeline: [
      { time: '16:00', event: 'Reports of calendar sync failures', status: 'investigating' },
      { time: '16:15', event: 'Third-party API rate limit reached', status: 'identified' },
      { time: '16:30', event: 'Rate limit increased and sync resumed', status: 'resolved' }
    ]
  }
]

const severityConfig = {
  minor: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    label: 'Minor'
  },
  major: {
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    label: 'Major'
  },
  critical: {
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/20',
    label: 'Critical'
  }
}

const statusConfig = {
  investigating: {
    icon: AlertCircle,
    color: 'text-yellow-500'
  },
  identified: {
    icon: Activity,
    color: 'text-orange-500'
  },
  monitoring: {
    icon: Clock,
    color: 'text-blue-500'
  },
  resolved: {
    icon: CheckCircle,
    color: 'text-green-500'
  }
}

export function IncidentHistory() {
  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold mb-8"
      >
        Recent Incidents
      </motion.h2>

      <div className="space-y-6">
        {incidents.map((incident, index) => {
          const severity = severityConfig[incident.severity]
          
          return (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        {incident.title}
                        <Badge className={`${severity.bg} ${severity.color} border-0`}>
                          {severity.label}
                        </Badge>
                        {incident.status === 'resolved' && (
                          <Badge variant="secondary" className="text-green-600">
                            Resolved
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{incident.date}</span>
                        <span>Duration: {incident.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Affected Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {incident.affectedServices.map((service) => (
                        <Badge key={service} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-3">Timeline:</p>
                    <div className="space-y-3">
                      {incident.timeline.map((event, i) => {
                        const status = statusConfig[event.status]
                        const StatusIcon = status.icon
                        
                        return (
                          <div key={i} className="flex items-start gap-3">
                            <StatusIcon className={`h-5 w-5 mt-0.5 ${status.color}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{event.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {event.event}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}