'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@sports-tracker/ui'

const faqs = [
  {
    question: 'Can I switch between plans?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you\'ll be charged a prorated amount for the remainder of your billing cycle. If you downgrade, the change will take effect at the start of your next billing cycle.'
  },
  {
    question: 'Is there a free trial for Pro and Team plans?',
    answer: 'Absolutely! Both Pro and Team plans come with a 14-day free trial. No credit card required to start. You\'ll only be charged if you decide to continue after the trial period.'
  },
  {
    question: 'How do SMS notifications work?',
    answer: 'SMS notifications are available on Pro and Team plans. You\'ll receive a text message before your selected events start. Standard messaging rates may apply depending on your carrier. You can customize notification timing and which events trigger SMS alerts.'
  },
  {
    question: 'What sports are covered?',
    answer: 'We currently track Formula 1, Formula E, MotoGP, UFC, Boxing, WWE, IndyCar, WEC/IMSA, and major football leagues. We\'re constantly adding more sports based on user feedback. Free users can track up to 3 sports, while Pro and Team users have unlimited access.'
  },
  {
    question: 'Can I export events to my calendar?',
    answer: 'Pro and Team users can export events to Google Calendar, Apple Calendar, Outlook, and any calendar app that supports .ics files. You can export individual events or set up automatic sync for your favorite sports.'
  },
  {
    question: 'What\'s included in API access?',
    answer: 'Team plan includes full API access with endpoints for events, results, teams, and more. You get 100,000 requests per month, webhook support, and comprehensive documentation. Perfect for building custom integrations or powering your own applications.'
  },
  {
    question: 'How does the no-spoiler mode work?',
    answer: 'No-spoiler mode hides event results until you\'re ready to see them. This feature is available on all plans. You can toggle it globally or for specific sports, and even set automatic reveal times for different event types.'
  },
  {
    question: 'What if I need to cancel?',
    answer: 'You can cancel your subscription at any time with no questions asked. You\'ll continue to have access to paid features until the end of your current billing period. We also offer a 30-day money-back guarantee for annual subscriptions.'
  }
]

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about our pricing and features
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className={cn(
                'w-full text-left p-6 rounded-lg border transition-all',
                'hover:border-primary/50 hover:shadow-md',
                openIndex === index && 'border-primary shadow-md bg-primary/5'
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold pr-4">{faq.question}</h3>
                <ChevronDown 
                  className={cn(
                    'h-5 w-5 text-muted-foreground shrink-0 transition-transform',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </div>
              
              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="mt-4 text-muted-foreground pr-12">
                  {faq.answer}
                </p>
              </motion.div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}