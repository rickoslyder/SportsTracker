'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Switch, Label } from '@sports-tracker/ui'
import { cn } from '@sports-tracker/ui'
import { motion } from 'framer-motion'
import { Check, X, Zap, Shield, Globe, HeartHandshake } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    description: 'Perfect for casual sports fans',
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    features: [
      { name: 'Track up to 3 sports', included: true },
      { name: 'Basic event reminders', included: true },
      { name: 'No spoiler mode', included: true },
      { name: '7-day event history', included: true },
      { name: 'Email notifications', included: true },
      { name: 'Calendar export', included: false },
      { name: 'Multi-device sync', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom reminder times', included: false },
      { name: 'API access', included: false }
    ]
  },
  {
    name: 'Pro',
    description: 'For dedicated sports enthusiasts',
    monthlyPrice: 9.99,
    yearlyPrice: 99,
    popular: true,
    features: [
      { name: 'Unlimited sports tracking', included: true },
      { name: 'Advanced reminders', included: true },
      { name: 'No spoiler mode', included: true },
      { name: 'Full event history', included: true },
      { name: 'Email & SMS notifications', included: true },
      { name: 'Calendar export', included: true },
      { name: 'Multi-device sync', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom reminder times', included: true },
      { name: 'API access', included: false }
    ]
  },
  {
    name: 'Team',
    description: 'For organizations and developers',
    monthlyPrice: 29.99,
    yearlyPrice: 299,
    popular: false,
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Team management', included: true },
      { name: 'Shared calendars', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Webhook notifications', included: true },
      { name: 'Full API access', included: true },
      { name: 'White-label options', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'SLA guarantee', included: true },
      { name: 'Custom features', included: true }
    ]
  }
]

export function PricingCards() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Label htmlFor="billing-toggle" className={cn(!isYearly && 'text-primary')}>
          Monthly
        </Label>
        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="billing-toggle" className={cn(isYearly && 'text-primary')}>
          Yearly
          <Badge variant="secondary" className="ml-2">
            Save 20%
          </Badge>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
          const period = isYearly ? '/year' : '/month'
          
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn(
                'relative h-full transition-all duration-200',
                plan.popular && 'border-primary shadow-lg scale-105',
                'hover:shadow-xl'
              )}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      <Zap className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                  
                  <div className="mt-6">
                    <span className="text-4xl font-bold">
                      ${price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {price > 0 && period}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={price === 0 ? '/sign-up' : `/checkout?plan=${plan.name.toLowerCase()}&billing=${isYearly ? 'yearly' : 'monthly'}`}>
                      {price === 0 ? 'Get Started Free' : 'Start Free Trial'}
                    </Link>
                  </Button>
                  
                  <ul className="space-y-3 pt-4">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                        )}
                        <span className={cn(
                          'text-sm',
                          !feature.included && 'text-muted-foreground'
                        )}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
        {[
          { icon: Shield, label: 'Secure Payments', description: 'SSL encrypted' },
          { icon: Globe, label: 'Global Coverage', description: '150+ countries' },
          { icon: HeartHandshake, label: 'No Hidden Fees', description: 'Cancel anytime' },
          { icon: Zap, label: 'Instant Access', description: 'Start immediately' }
        ].map((badge, index) => {
          const Icon = badge.icon
          return (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-2">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium text-sm">{badge.label}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}