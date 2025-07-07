'use client'

import { motion } from 'framer-motion'
import { GradientText } from '../common/gradient-text'
import Image from 'next/image'

export function CompanyStory() {
  return (
    <section className="mb-24">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          We're <GradientText gradient="sport">Passionate</GradientText> About Sports
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Born from the frustration of missing crucial sporting moments, we built Sports Event Tracker 
          to ensure no fan ever misses their favorite events again.
        </p>
      </motion.div>

      {/* Story Grid */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              It started with a missed Formula 1 race in 2021. Our founder, an avid motorsport fan, 
              woke up to spoilers flooding social media, having completely forgotten about the time 
              zone difference for the Australian Grand Prix.
            </p>
            <p>
              That moment of frustration sparked an idea: what if there was a simple way to track 
              all your favorite sports events across different time zones, with smart reminders that 
              actually work?
            </p>
            <p>
              Today, Sports Event Tracker serves over 100,000 sports fans worldwide, helping them 
              stay connected to the sports they love, no matter where or when they happen.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative h-[400px] rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-f1-red/20 via-motogp-red/20 to-ufc-gold/20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl font-bold text-primary mb-2">100K+</div>
              <div className="text-xl text-muted-foreground">Active Users</div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">7+</div>
                  <div className="text-sm text-muted-foreground">Sports</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">150+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1M+</div>
                  <div className="text-sm text-muted-foreground">Events Tracked</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}