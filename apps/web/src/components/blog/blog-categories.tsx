'use client'

import { motion } from 'framer-motion'
import { Badge } from '@sports-tracker/ui'
import { cn } from '@sports-tracker/ui'

const categories = [
  { name: 'All Posts', count: 47, active: true },
  { name: 'Product Updates', count: 12 },
  { name: 'Tips & Tricks', count: 15 },
  { name: 'Sports News', count: 8 },
  { name: 'Behind the Scenes', count: 6 },
  { name: 'User Stories', count: 6 }
]

export function BlogCategories() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category, index) => (
          <motion.button
            key={category.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-4 py-2 rounded-full transition-all duration-200',
              category.active
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            <span className="font-medium">{category.name}</span>
            <Badge 
              variant={category.active ? 'secondary' : 'outline'} 
              className="ml-2"
            >
              {category.count}
            </Badge>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}