'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

interface LastUpdatedProps {
  date: string
}

export function LastUpdated({ date }: LastUpdatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
    >
      <Calendar className="h-4 w-4" />
      <span>Last updated: {date}</span>
    </motion.div>
  )
}