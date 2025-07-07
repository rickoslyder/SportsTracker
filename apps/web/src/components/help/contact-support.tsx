'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@sports-tracker/ui'
import { Button } from '@sports-tracker/ui'
import { 
  MessageCircle, 
  Mail, 
  Video, 
  FileText,
  ArrowRight,
  Sparkles 
} from 'lucide-react'
import Link from 'next/link'
import { GradientText } from '../common/gradient-text'

const contactOptions = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team',
    availability: 'Available 24/7',
    action: 'Start Chat',
    primary: true
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help via email',
    availability: 'Response within 24h',
    action: 'Send Email',
    href: 'mailto:support@sportstracker.com'
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Watch helpful guides',
    availability: '50+ tutorials',
    action: 'Watch Videos',
    href: '/help/videos'
  },
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Read detailed guides',
    availability: 'Always available',
    action: 'View Docs',
    href: '/docs'
  }
]

export function ContactSupport() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">
          Still Need <GradientText gradient="primary">Help?</GradientText>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our support team is here to help you get the most out of Sports Event Tracker
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contactOptions.map((option, index) => {
          const Icon = option.icon
          return (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`h-full ${option.primary ? 'border-primary shadow-lg' : ''}`}>
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-full mb-4 ${
                    option.primary ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {option.description}
                  </p>
                  <p className="text-xs text-primary font-medium mb-4">
                    {option.availability}
                  </p>
                  
                  <Button 
                    variant={option.primary ? 'default' : 'outline'}
                    className="w-full"
                    asChild
                  >
                    {option.href ? (
                      <Link href={option.href}>
                        {option.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    ) : (
                      <button>
                        {option.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* FAQ Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"
      >
        <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Frequently Asked Questions</h3>
        <p className="text-muted-foreground mb-4">
          Find quick answers to common questions
        </p>
        <Button variant="outline" asChild>
          <Link href="/help/faq">
            Browse FAQ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </section>
  )
}