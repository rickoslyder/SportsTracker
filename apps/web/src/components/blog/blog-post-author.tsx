'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@sports-tracker/ui'
import { Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

export function BlogPostAuthor() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-12"
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-primary">AC</span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Alex Chen</h3>
              <p className="text-sm text-primary mb-3">Founder & CEO</p>
              <p className="text-muted-foreground mb-4">
                F1 fanatic who turned a missed race into a mission. Previously at ESPN, 
                now building the future of sports event tracking. Follow me for more 
                insights on never missing your favorite sports moments.
              </p>
              
              <div className="flex items-center gap-3">
                <Link 
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link 
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}