'use client'

import { motion } from 'framer-motion'
import { Badge } from '@sports-tracker/ui'
import { Calendar, Clock, Share2, Bookmark } from 'lucide-react'
import { Button } from '@sports-tracker/ui'

export function BlogPostHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">Tips & Tricks</Badge>
        <Badge variant="outline">F1</Badge>
        <Badge variant="outline">Time Zones</Badge>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
        Never Miss Another F1 Race: Ultimate Guide to Time Zone Management
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>January 15, 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>5 min read</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </motion.header>
  )
}