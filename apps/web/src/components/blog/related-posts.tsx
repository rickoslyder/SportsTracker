'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, Badge } from '@sports-tracker/ui'
import { ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

const relatedPosts = [
  {
    id: 2,
    title: 'Setting Up Smart Notifications for Multiple Sports',
    excerpt: 'Learn how to customize notifications for different sports and avoid alert fatigue.',
    category: 'Tips & Tricks',
    readTime: '4 min read'
  },
  {
    id: 3,
    title: 'F1 2024 Calendar: Key Dates and Times',
    excerpt: 'Complete breakdown of the F1 2024 season with local times for every session.',
    category: 'Sports News',
    readTime: '3 min read'
  },
  {
    id: 4,
    title: 'MotoGP vs F1: Managing Multiple Racing Series',
    excerpt: 'How to track both MotoGP and F1 without missing any of the action.',
    category: 'Tips & Tricks',
    readTime: '5 min read'
  }
]

export function RelatedPosts() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Read more</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}