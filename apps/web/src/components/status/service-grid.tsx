'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@sports-tracker/ui'
import { 
  Globe, 
  Smartphone, 
  Database, 
  Bell, 
  Calendar, 
  Zap, 
  Shield, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'

const services = [
  {
    name: 'Web Application',
    icon: Globe,
    status: 'operational',
    uptime: '99.99%',
    responseTime: '45ms'
  },
  {
    name: 'Mobile Apps',
    icon: Smartphone,
    status: 'operational',
    uptime: '99.98%',
    responseTime: '120ms'
  },
  {
    name: 'API',
    icon: Database,
    status: 'operational',
    uptime: '99.99%',
    responseTime: '28ms'
  },
  {
    name: 'Notifications',
    icon: Bell,
    status: 'operational',
    uptime: '99.95%',
    responseTime: '250ms'
  },
  {
    name: 'Calendar Sync',
    icon: Calendar,
    status: 'operational',
    uptime: '99.90%',
    responseTime: '180ms'
  },
  {
    name: 'Real-time Updates',
    icon: Zap,
    status: 'operational',
    uptime: '99.97%',
    responseTime: '15ms'
  },
  {
    name: 'Authentication',
    icon: Shield,
    status: 'operational',
    uptime: '100%',
    responseTime: '35ms'
  },
  {
    name: 'Payment Processing',
    icon: CreditCard,
    status: 'operational',
    uptime: '100%',
    responseTime: '350ms'
  }
]

const statusConfig = {
  operational: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: 'Operational'
  },
  degraded: {
    icon: AlertCircle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    label: 'Degraded'
  },
  outage: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    label: 'Outage'
  }
}

export function ServiceGrid() {
  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold mb-8"
      >
        Service Status
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => {
          const ServiceIcon = service.icon
          const status = statusConfig[service.status]
          const StatusIcon = status.icon

          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ServiceIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-base font-medium">{service.name}</span>
                    </div>
                    <StatusIcon className={`h-5 w-5 ${status.color}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                    {status.label}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Response</span>
                      <span className="font-medium">{service.responseTime}</span>
                    </div>
                  </div>

                  <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: service.uptime }}
                    />
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