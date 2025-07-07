'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@sports-tracker/ui'
import { 
  BookOpen, 
  Settings, 
  Users, 
  Tv, 
  Bell, 
  Layers,
  ChevronRight 
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    articles: [
      { title: 'Creating your first account', href: '#' },
      { title: 'Adding your favorite sports', href: '#' },
      { title: 'Understanding the dashboard', href: '#' },
      { title: 'Setting up your profile', href: '#' }
    ]
  },
  {
    icon: Bell,
    title: 'Notifications & Reminders',
    articles: [
      { title: 'Setting up email notifications', href: '#' },
      { title: 'Configuring SMS alerts', href: '#' },
      { title: 'Custom reminder times', href: '#' },
      { title: 'Managing notification preferences', href: '#' }
    ]
  },
  {
    icon: Tv,
    title: 'Sports & Events',
    articles: [
      { title: 'Supported sports list', href: '#' },
      { title: 'Finding specific events', href: '#' },
      { title: 'Understanding event details', href: '#' },
      { title: 'Tracking multiple sports', href: '#' }
    ]
  },
  {
    icon: Settings,
    title: 'Account & Settings',
    articles: [
      { title: 'Updating account information', href: '#' },
      { title: 'Privacy settings', href: '#' },
      { title: 'Time zone configuration', href: '#' },
      { title: 'Deleting your account', href: '#' }
    ]
  },
  {
    icon: Layers,
    title: 'Features & Tools',
    articles: [
      { title: 'Using no-spoiler mode', href: '#' },
      { title: 'Calendar integration', href: '#' },
      { title: 'Multi-device sync', href: '#' },
      { title: 'API access guide', href: '#' }
    ]
  },
  {
    icon: Users,
    title: 'Teams & Collaboration',
    articles: [
      { title: 'Creating a team workspace', href: '#' },
      { title: 'Inviting team members', href: '#' },
      { title: 'Shared calendars', href: '#' },
      { title: 'Team billing management', href: '#' }
    ]
  }
]

export function HelpCategories() {
  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-12"
      >
        Browse by Category
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.articles.map((article) => (
                      <li key={article.title}>
                        <Link 
                          href={article.href}
                          className="flex items-center justify-between group hover:text-primary transition-colors"
                        >
                          <span className="text-sm">{article.title}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href={`/help/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-2 text-sm text-primary font-medium mt-4 hover:underline"
                  >
                    View all articles
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}