'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Trophy, Rocket, Globe, Zap } from 'lucide-react'

const milestones = [
  {
    year: '2021',
    title: 'The Idea',
    description: 'Sports Event Tracker was born from a missed F1 race and the determination to never let it happen again.',
    icon: Calendar,
    color: 'from-blue-500 to-blue-600'
  },
  {
    year: '2022',
    title: 'First Launch',
    description: 'Launched with support for Formula 1, MotoGP, and UFC. 1,000 users in the first month.',
    icon: Rocket,
    color: 'from-green-500 to-green-600'
  },
  {
    year: '2023',
    title: 'Going Global',
    description: 'Expanded to 7 sports and 150+ countries. Introduced multi-language support.',
    icon: Globe,
    color: 'from-purple-500 to-purple-600'
  },
  {
    year: '2023',
    title: '50K Users',
    description: 'Hit 50,000 active users and launched Pro tier with advanced features.',
    icon: Users,
    color: 'from-orange-500 to-orange-600'
  },
  {
    year: '2024',
    title: '100K Milestone',
    description: 'Reached 100,000 users and introduced real-time notifications and team features.',
    icon: Trophy,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    year: '2025',
    title: 'The Future',
    description: 'AI-powered predictions, augmented reality features, and more sports coming soon.',
    icon: Zap,
    color: 'from-pink-500 to-pink-600'
  }
]

export function Timeline() {
  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Journey</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          From a simple idea to a global platform, here's how we've grown
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 hidden md:block" />

        <div className="space-y-12">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon
            const isLeft = index % 2 === 0

            return (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}
              >
                {/* Content */}
                <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`inline-block ${isLeft ? 'md:ml-auto' : ''}`}>
                    <div className="bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow max-w-md">
                      <div className="text-sm font-semibold text-primary mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                </div>

                {/* Icon */}
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}