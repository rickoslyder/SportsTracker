'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@sports-tracker/ui'
import { 
  Zap, 
  Clock, 
  Smartphone, 
  Shield, 
  CreditCard, 
  MessageCircle,
  ArrowRight 
} from 'lucide-react'
import Link from 'next/link'

const quickLinks = [
  {
    icon: Zap,
    title: 'Getting Started',
    description: 'New to Sports Event Tracker? Start here',
    href: '/help/getting-started',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Clock,
    title: 'Setting Reminders',
    description: 'Never miss an event with smart alerts',
    href: '/help/reminders',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Download and set up our mobile apps',
    href: '/help/mobile',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Shield,
    title: 'No Spoiler Mode',
    description: 'Watch events on your schedule',
    href: '/help/no-spoilers',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: CreditCard,
    title: 'Billing & Plans',
    description: 'Manage your subscription',
    href: '/help/billing',
    color: 'from-red-500 to-rose-500'
  },
  {
    icon: MessageCircle,
    title: 'Contact Support',
    description: 'Get help from our team',
    href: '/help/contact',
    color: 'from-indigo-500 to-blue-500'
  }
]

export function QuickLinks() {
  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {quickLinks.map((link, index) => {
          const Icon = link.icon
          return (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={link.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${link.color} text-white shrink-0`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {link.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}