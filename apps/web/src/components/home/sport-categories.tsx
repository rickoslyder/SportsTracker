'use client'

import { Card } from '@sports-tracker/ui'
import { motion } from 'framer-motion'
import { cn } from '@sports-tracker/ui'
import Link from 'next/link'
import { AnimatedCounter } from '../common/animated-counter'

const sports = [
  {
    id: 'f1',
    name: 'Formula 1',
    icon: '🏎️',
    color: 'from-f1-red to-f1-black',
    borderColor: 'border-f1-red',
    events: 23,
    description: 'Grand Prix racing at its finest'
  },
  {
    id: 'formula-e',
    name: 'Formula E',
    icon: '⚡',
    color: 'from-formula-e-blue to-formula-e-black',
    borderColor: 'border-formula-e-blue',
    events: 16,
    description: 'Electric street racing championship'
  },
  {
    id: 'motogp',
    name: 'MotoGP',
    icon: '🏍️',
    color: 'from-motogp-red to-motogp-black',
    borderColor: 'border-motogp-red',
    events: 21,
    description: 'Premier motorcycle racing'
  },
  {
    id: 'ufc',
    name: 'UFC',
    icon: '🥊',
    color: 'from-ufc-red to-ufc-gold',
    borderColor: 'border-ufc-red',
    events: 42,
    description: 'Mixed martial arts championship'
  },
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
    color: 'from-football-green to-green-900',
    borderColor: 'border-football-green',
    events: 380,
    description: 'Major league matches'
  },
  {
    id: 'indycar',
    name: 'IndyCar',
    icon: '🏁',
    color: 'from-indycar-blue to-indycar-red',
    borderColor: 'border-indycar-blue',
    events: 17,
    description: 'American open-wheel racing'
  }
]

export function SportCategories() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Track Your Favorite Sports
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive coverage of major motorsports and sporting events worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport, index) => (
            <motion.div
              key={sport.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/events?sport=${sport.id}`}>
                <Card className={cn(
                  'group relative overflow-hidden transition-all duration-300',
                  'hover:shadow-xl hover:-translate-y-1',
                  'border-2 border-transparent hover:' + sport.borderColor
                )}>
                  {/* Gradient background on hover */}
                  <div className={cn(
                    'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300',
                    'bg-gradient-to-br',
                    sport.color
                  )} />
                  
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{sport.icon}</div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">
                          <AnimatedCounter end={sport.events} duration={1500} />
                        </p>
                        <p className="text-sm text-muted-foreground">events</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{sport.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {sport.description}
                    </p>
                    
                    <div className={cn(
                      'absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r',
                      sport.color,
                      'transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300'
                    )} />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}