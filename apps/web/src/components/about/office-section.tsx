'use client'

import { motion } from 'framer-motion'
import { MapPin, Users, Coffee, Gamepad2 } from 'lucide-react'
import { Card, CardContent } from '@sports-tracker/ui'

const offices = [
  {
    city: 'San Francisco',
    country: 'USA',
    type: 'Headquarters',
    address: '123 Mission Street, San Francisco, CA 94105',
    stats: {
      team: 25,
      founded: '2021'
    },
    features: ['Dog-friendly', 'Game room', 'Roof deck', 'Daily lunch']
  },
  {
    city: 'London',
    country: 'UK',
    type: 'Engineering Hub',
    address: '456 Tech City, London EC2A 4BX',
    stats: {
      team: 15,
      founded: '2023'
    },
    features: ['24/7 access', 'Racing sim setup', 'Coffee bar', 'Gym']
  },
  {
    city: 'Remote',
    country: 'Worldwide',
    type: 'Global Team',
    address: 'Everywhere sports happen',
    stats: {
      team: 40,
      founded: '2021'
    },
    features: ['Flexible hours', 'Home office budget', 'Annual meetups', 'Sports tickets']
  }
]

export function OfficeSection() {
  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Offices</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Building a global product from global locations
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {offices.map((office, index) => (
          <motion.div
            key={office.city}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{office.city}</h3>
                    <p className="text-sm text-muted-foreground">{office.country}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-primary mb-1">{office.type}</p>
                  <p className="text-sm text-muted-foreground">{office.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-2xl font-bold">{office.stats.team}</p>
                    <p className="text-xs text-muted-foreground">Team members</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Since</p>
                    <p className="text-2xl font-bold">{office.stats.founded}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium mb-2">Perks</p>
                  <div className="flex flex-wrap gap-2">
                    {office.features.map((feature) => (
                      <span 
                        key={feature}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <Coffee className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-4">Work Culture</h3>
          <p className="text-muted-foreground">
            We believe in work-life balance, especially when that life involves watching sports. 
            Flexible hours for game days, unlimited PTO, and annual tickets to sporting events 
            of your choice. Because we know the best ideas come when you're doing what you love.
          </p>
        </div>
      </motion.div>
    </section>
  )
}