'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { GradientText } from './gradient-text'

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b"
      >
        <div className="container">
          <div className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-3 flex-1">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm">
                <span className="font-medium">New:</span>{' '}
                <GradientText gradient="primary" className="font-semibold">
                  Formula 1 2024 Season
                </GradientText>{' '}
                calendar now available with all race times!
              </p>
              <Link 
                href="/blog/f1-2024-calendar"
                className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
              >
                Learn more
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}