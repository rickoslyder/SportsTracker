'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, Badge } from '@sports-tracker/ui'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const blogPosts = [
  {
    id: 1,
    title: 'Never Miss Another F1 Race: Ultimate Guide to Time Zone Management',
    excerpt: 'Learn how to track Formula 1 races across different time zones and set up perfect reminders for every session.',
    category: 'Tips & Tricks',
    author: 'Alex Chen',
    date: '2024-01-15',
    readTime: '5 min read',
    featured: true,
    image: '/api/placeholder/800/400',
    tags: ['F1', 'Time Zones', 'Reminders']
  },
  {
    id: 2,
    title: 'New Feature: Multi-Device Sync Now Available',
    excerpt: 'Keep your sports tracking synchronized across all your devices with our new cloud sync feature.',
    category: 'Product Updates',
    author: 'Sarah Martinez',
    date: '2024-01-12',
    readTime: '3 min read',
    image: '/api/placeholder/800/400',
    tags: ['Features', 'Sync', 'Updates']
  },
  {
    id: 3,
    title: 'MotoGP 2024 Season Preview: What to Track',
    excerpt: 'Get ready for the upcoming MotoGP season with our comprehensive tracking guide and calendar setup tips.',
    category: 'Sports News',
    author: 'James Wilson',
    date: '2024-01-10',
    readTime: '7 min read',
    image: '/api/placeholder/800/400',
    tags: ['MotoGP', 'Season Preview', 'Calendar']
  },
  {
    id: 4,
    title: 'How We Built Real-Time Notifications',
    excerpt: 'A deep dive into the technical challenges of building a real-time notification system for sports events.',
    category: 'Behind the Scenes',
    author: 'Tom Anderson',
    date: '2024-01-08',
    readTime: '10 min read',
    image: '/api/placeholder/800/400',
    tags: ['Engineering', 'Notifications', 'Tech']
  },
  {
    id: 5,
    title: 'User Spotlight: How John Tracks 5 Different Sports',
    excerpt: 'Meet John, a super fan who uses Sports Event Tracker to follow F1, UFC, NFL, NBA, and Premier League.',
    category: 'User Stories',
    author: 'Lisa Kim',
    date: '2024-01-05',
    readTime: '4 min read',
    image: '/api/placeholder/800/400',
    tags: ['User Story', 'Multi-Sport', 'Tips']
  },
  {
    id: 6,
    title: 'UFC Fight Night: Setting Up Smart Reminders',
    excerpt: 'Never miss a UFC event again with our guide to setting up intelligent reminders for fight nights.',
    category: 'Tips & Tricks',
    author: 'Maya Patel',
    date: '2024-01-03',
    readTime: '6 min read',
    image: '/api/placeholder/800/400',
    tags: ['UFC', 'Reminders', 'Guide']
  }
]

export function BlogGrid() {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.id}`}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                {/* Image */}
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {post.featured && (
                    <Badge className="absolute top-4 left-4 z-10">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-primary/20">
                      {post.category[0]}
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Read more</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mt-12"
      >
        <button className="px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200">
          Load More Articles
        </button>
      </motion.div>
    </section>
  )
}