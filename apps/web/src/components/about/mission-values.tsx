'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Users, Zap, Shield, Globe } from 'lucide-react'
import { Card, CardContent } from '@sports-tracker/ui'

const values = [
  {
    icon: Heart,
    title: 'Fan-First',
    description: 'Every decision we make starts with our users. We\'re fans building for fans.',
    color: 'text-red-500'
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Sports happen everywhere. We ensure you can follow your passion from anywhere.',
    color: 'text-blue-500'
  },
  {
    icon: Shield,
    title: 'No Spoilers',
    description: 'We protect your viewing experience with industry-leading spoiler prevention.',
    color: 'text-green-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Real-time updates and instant notifications keep you always in the know.',
    color: 'text-yellow-500'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Built by the community, for the community. Your feedback shapes our product.',
    color: 'text-purple-500'
  },
  {
    icon: Target,
    title: 'Precision Timing',
    description: 'Accurate scheduling across time zones means you\'ll never miss a moment.',
    color: 'text-orange-500'
  }
]

export function MissionValues() {
  return (
    <section className="mb-24">
      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          To connect every sports fan with the events they love, ensuring no one ever misses 
          a moment that matters. We believe sports bring people together, and we're here to 
          make that connection seamless.
        </p>
      </motion.div>

      {/* Values Grid */}
      <div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-center mb-12"
        >
          Our Values
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-lg bg-background mb-4 ${value.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{value.title}</h4>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}