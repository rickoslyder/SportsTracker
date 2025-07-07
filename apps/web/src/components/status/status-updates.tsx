'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@sports-tracker/ui'
import { Button } from '@sports-tracker/ui'
import { Input } from '@sports-tracker/ui'
import { Bell, Mail, MessageSquare, Rss, ArrowRight } from 'lucide-react'
import { GradientText } from '../common/gradient-text'

const subscribeOptions = [
  {
    icon: Bell,
    title: 'Push Notifications',
    description: 'Get instant alerts on your device',
    action: 'Enable'
  },
  {
    icon: Mail,
    title: 'Email Updates',
    description: 'Receive status updates via email',
    action: 'Subscribe'
  },
  {
    icon: MessageSquare,
    title: 'SMS Alerts',
    description: 'Critical updates via text message',
    action: 'Set Up'
  },
  {
    icon: Rss,
    title: 'RSS Feed',
    description: 'Subscribe to our status RSS feed',
    action: 'Get Feed'
  }
]

export function StatusUpdates() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">
          Stay <GradientText gradient="primary">Informed</GradientText>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Subscribe to status updates and never miss important service announcements
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Subscribe Options */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Subscribe to Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscribeOptions.map((option) => {
                const Icon = option.icon
                return (
                  <div
                    key={option.title}
                    className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{option.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {option.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Subscribe Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quick Email Subscribe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Get email notifications for major incidents and scheduled maintenance
              </p>
              
              <form className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                />
                
                <div className="space-y-3">
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" defaultChecked />
                    <span className="text-sm">
                      Major outages and incidents
                    </span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" defaultChecked />
                    <span className="text-sm">
                      Scheduled maintenance notifications
                    </span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm">
                      Weekly status summaries
                    </span>
                  </label>
                </div>

                <Button className="w-full">
                  Subscribe to Updates
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Status Page Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-12 text-center p-8 rounded-2xl bg-muted/30"
      >
        <h3 className="text-xl font-bold mb-4">About This Status Page</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          This page provides real-time information about the operational status of Sports Event Tracker 
          services. We update this page with incidents, scheduled maintenance, and service degradations 
          as they occur.
        </p>
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <a href="/api/status" className="text-primary hover:underline">
            Status API
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="/help/status" className="text-primary hover:underline">
            Understanding Status
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="/contact" className="text-primary hover:underline">
            Report an Issue
          </a>
        </div>
      </motion.div>
    </section>
  )
}