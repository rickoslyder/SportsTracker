'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@sports-tracker/ui'
import { Github, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'

const team = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    bio: 'F1 fanatic who turned a missed race into a mission. Previously at ESPN.',
    image: '/api/placeholder/200/200',
    social: {
      twitter: '#',
      linkedin: '#',
      github: '#'
    }
  },
  {
    name: 'Sarah Martinez',
    role: 'CTO',
    bio: 'Full-stack engineer passionate about real-time systems. MotoGP enthusiast.',
    image: '/api/placeholder/200/200',
    social: {
      twitter: '#',
      linkedin: '#',
      github: '#'
    }
  },
  {
    name: 'James Wilson',
    role: 'Head of Product',
    bio: 'UFC fan dedicated to creating the best user experience for sports tracking.',
    image: '/api/placeholder/200/200',
    social: {
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    name: 'Maya Patel',
    role: 'Lead Designer',
    bio: 'Creating beautiful experiences for sports fans. Formula E advocate.',
    image: '/api/placeholder/200/200',
    social: {
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    name: 'Tom Anderson',
    role: 'Backend Engineer',
    bio: 'Building reliable systems that never miss a beat. Boxing aficionado.',
    image: '/api/placeholder/200/200',
    social: {
      github: '#',
      linkedin: '#'
    }
  },
  {
    name: 'Lisa Kim',
    role: 'Marketing Lead',
    bio: 'Spreading the word about never missing a moment. WWE superfan.',
    image: '/api/placeholder/200/200',
    social: {
      twitter: '#',
      linkedin: '#'
    }
  }
]

export function TeamSection() {
  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet the Team</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Passionate sports fans building the future of event tracking
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                
                <div className="flex gap-3">
                  {member.social.twitter && (
                    <Link 
                      href={member.social.twitter}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </Link>
                  )}
                  {member.social.linkedin && (
                    <Link 
                      href={member.social.linkedin}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                  )}
                  {member.social.github && (
                    <Link 
                      href={member.social.github}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}