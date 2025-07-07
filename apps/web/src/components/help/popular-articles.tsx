'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@sports-tracker/ui'
import { TrendingUp, Clock, Users, Eye, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@sports-tracker/ui'

const popularArticles = [
  {
    title: 'How to set up reminders for F1 race weekends',
    category: 'Notifications',
    views: '12.5k',
    readTime: '3 min',
    trending: true
  },
  {
    title: 'Managing time zones for international events',
    category: 'Features',
    views: '8.3k',
    readTime: '5 min',
    trending: true
  },
  {
    title: 'Using no-spoiler mode effectively',
    category: 'Features',
    views: '7.1k',
    readTime: '2 min',
    trending: false
  },
  {
    title: 'Syncing your calendar with Sports Event Tracker',
    category: 'Integration',
    views: '6.8k',
    readTime: '4 min',
    trending: false
  },
  {
    title: 'Setting up team workspaces',
    category: 'Teams',
    views: '5.2k',
    readTime: '6 min',
    trending: false
  },
  {
    title: 'Troubleshooting notification issues',
    category: 'Troubleshooting',
    views: '4.9k',
    readTime: '3 min',
    trending: true
  }
]

export function PopularArticles() {
  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-4">Popular Articles</h2>
        <p className="text-muted-foreground">
          Most viewed help articles this month
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {popularArticles.map((article, index) => (
          <motion.article
            key={article.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href="#">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    {article.trending && (
                      <div className="flex items-center gap-1 text-orange-500">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-medium">Trending</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}