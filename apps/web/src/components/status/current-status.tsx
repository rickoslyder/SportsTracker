'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@sports-tracker/ui'
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react'

const statusStates = {
  operational: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: 'All Systems Operational',
    description: 'All services are running smoothly'
  },
  degraded: {
    icon: AlertCircle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    label: 'Degraded Performance',
    description: 'Some services may be experiencing issues'
  },
  partial: {
    icon: AlertCircle,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    label: 'Partial Outage',
    description: 'Some services are unavailable'
  },
  major: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    label: 'Major Outage',
    description: 'Multiple services are experiencing issues'
  }
}

export function CurrentStatus() {
  // In a real app, this would fetch from an API
  const currentStatus = 'operational'
  const status = statusStates[currentStatus]
  const Icon = status.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <Card className="overflow-hidden">
        <div className={`h-2 ${currentStatus === 'operational' ? 'bg-green-500' : currentStatus === 'degraded' ? 'bg-yellow-500' : currentStatus === 'partial' ? 'bg-orange-500' : 'bg-red-500'}`} />
        <CardContent className="p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${status.bg}`}>
                <Icon className={`h-8 w-8 ${status.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{status.label}</h2>
                <p className="text-muted-foreground">{status.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last updated</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}