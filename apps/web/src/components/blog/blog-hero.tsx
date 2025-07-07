'use client'

import { motion } from 'framer-motion'
import { GradientText } from '../common/gradient-text'
import { Search } from 'lucide-react'
import { Input } from '@sports-tracker/ui'

export function BlogHero() {
  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Sports Event <GradientText gradient="sport">Insights</GradientText>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Tips, updates, and stories from the world of sports event tracking. 
          Learn how to make the most of your sports viewing experience.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search articles..." 
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}