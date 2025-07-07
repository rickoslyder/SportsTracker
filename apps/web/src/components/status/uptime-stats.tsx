'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@sports-tracker/ui'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const uptimeData = [
  {
    period: 'Last 24 Hours',
    uptime: '100%',
    trend: 'up',
    incidents: 0
  },
  {
    period: 'Last 7 Days',
    uptime: '99.98%',
    trend: 'stable',
    incidents: 1
  },
  {
    period: 'Last 30 Days',
    uptime: '99.95%',
    trend: 'up',
    incidents: 2
  },
  {
    period: 'Last 90 Days',
    uptime: '99.93%',
    trend: 'stable',
    incidents: 3
  }
]

export function UptimeStats() {
  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold mb-8"
      >
        Uptime Statistics
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {uptimeData.map((stat, index) => (
          <motion.div
            key={stat.period}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">{stat.period}</p>
                
                <div className="flex items-end justify-between mb-4">
                  <div className="text-3xl font-bold">{stat.uptime}</div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-500' : 
                    stat.trend === 'down' ? 'text-red-500' : 
                    'text-muted-foreground'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : stat.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <Minus className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {stat.trend === 'up' ? 'Improving' : 
                       stat.trend === 'down' ? 'Declining' : 
                       'Stable'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Incidents</span>
                    <span className={`font-medium ${
                      stat.incidents === 0 ? 'text-green-500' : 
                      stat.incidents <= 2 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {stat.incidents}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Visual Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-8"
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">90-Day Uptime Timeline</h3>
            <div className="grid grid-cols-90 gap-0.5 h-16">
              {Array.from({ length: 90 }).map((_, i) => {
                // Simulate some random downtime
                const hasIncident = Math.random() > 0.98
                return (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      hasIncident ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    title={`Day ${90 - i}: ${hasIncident ? 'Incident' : 'Operational'}`}
                  />
                )
              })}
            </div>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-sm" />
                <span className="text-muted-foreground">Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-sm" />
                <span className="text-muted-foreground">Incident</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}