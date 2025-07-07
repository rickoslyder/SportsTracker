'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { GradientText } from '../common/gradient-text'

export function StatusHero() {
  return (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex p-3 rounded-full bg-green-500/10 mb-6">
          <Activity className="h-8 w-8 text-green-500" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          System <GradientText gradient="primary">Status</GradientText>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Track the operational status of Sports Event Tracker services in real-time. 
          We're committed to transparency and keeping you informed.
        </p>
      </motion.div>
    </section>
  )
}