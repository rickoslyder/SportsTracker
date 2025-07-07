'use client'

import { motion } from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'
import { Input } from '@sports-tracker/ui'
import { GradientText } from '../common/gradient-text'

export function HelpHero() {
  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-6">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          How Can We <GradientText gradient="primary">Help You?</GradientText>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Find answers to your questions, explore our guides, or contact our support team. 
          We're here to ensure you never miss a moment.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for help articles, guides, or features..." 
              className="pl-12 pr-4 h-14 text-lg shadow-lg border-2"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <span className="text-sm text-muted-foreground">Popular searches:</span>
            {['set reminders', 'time zones', 'sync devices', 'no spoiler mode'].map((term) => (
              <button
                key={term}
                className="text-sm text-primary hover:underline"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}