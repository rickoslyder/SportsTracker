'use client'

import { motion } from 'framer-motion'
import { Button, Input } from '@sports-tracker/ui'
import { Mail, Sparkles } from 'lucide-react'
import { GradientText } from '../common/gradient-text'

export function NewsletterSignup() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-24"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12">
        {/* Background decoration */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay in the <GradientText gradient="sport">Loop</GradientText>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            Get weekly updates on new features, sports tracking tips, and exclusive insights 
            delivered straight to your inbox.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12"
              required
            />
            <Button size="lg" className="h-12 px-8">
              <Sparkles className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            Join 25,000+ subscribers. No spam, unsubscribe anytime.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto">
            <div>
              <div className="text-2xl font-bold text-primary">25K+</div>
              <div className="text-sm text-muted-foreground">Subscribers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">Weekly</div>
              <div className="text-sm text-muted-foreground">Updates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Free</div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}