'use client'

import { motion } from 'framer-motion'
import { Button } from '@sports-tracker/ui'
import { ArrowRight, Briefcase, Code, Palette, Megaphone } from 'lucide-react'
import Link from 'next/link'
import { GradientText } from '../common/gradient-text'

const openRoles = [
  {
    icon: Code,
    department: 'Engineering',
    count: 5,
    roles: ['Senior Backend Engineer', 'iOS Developer', 'DevOps Engineer']
  },
  {
    icon: Palette,
    department: 'Design',
    count: 2,
    roles: ['Product Designer', 'Motion Designer']
  },
  {
    icon: Megaphone,
    department: 'Marketing',
    count: 3,
    roles: ['Content Marketing Manager', 'Social Media Manager', 'SEO Specialist']
  },
  {
    icon: Briefcase,
    department: 'Business',
    count: 2,
    roles: ['Business Development', 'Customer Success Manager']
  }
]

export function JoinTeam() {
  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Join Our <GradientText gradient="sport">Team</GradientText>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Help us build the future of sports event tracking. We're always looking for 
          passionate people who love sports and technology.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {openRoles.map((dept, index) => {
          const Icon = dept.icon
          return (
            <motion.div
              key={dept.department}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="h-full p-6 rounded-lg border border-border hover:border-primary transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-primary">{dept.count}</span>
                </div>
                <h3 className="font-semibold mb-2">{dept.department}</h3>
                <p className="text-sm text-muted-foreground">Open positions</p>
                <div className="mt-4 space-y-1">
                  {dept.roles.slice(0, 2).map((role) => (
                    <p key={role} className="text-xs text-muted-foreground truncate">
                      • {role}
                    </p>
                  ))}
                  {dept.roles.length > 2 && (
                    <p className="text-xs text-primary">
                      +{dept.roles.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/careers">
              View All Positions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">
              Don't see a fit? Contact us
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-muted/30 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4">Why Join Sports Event Tracker?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <p className="font-medium mb-1">🏆 Mission-Driven</p>
              <p className="text-sm text-muted-foreground">
                Help millions never miss their favorite sports moments
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">🌍 Global Impact</p>
              <p className="text-sm text-muted-foreground">
                Work with users and teammates from 150+ countries
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">🎯 Growth Opportunity</p>
              <p className="text-sm text-muted-foreground">
                Join a fast-growing startup with huge potential
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">🎮 Great Culture</p>
              <p className="text-sm text-muted-foreground">
                Sports fans building for sports fans
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}