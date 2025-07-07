'use client'

import { motion } from 'framer-motion'
import { GradientText } from '../common/gradient-text'
import { Shield } from 'lucide-react'

interface LegalHeaderProps {
  title: string
  description: string
}

export function LegalHeader({ title, description }: LegalHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <div className="inline-flex p-3 rounded-full bg-primary/10 mb-6">
        <Shield className="h-8 w-8 text-primary" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        <GradientText gradient="primary">{title}</GradientText>
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        {description}
      </p>
    </motion.header>
  )
}