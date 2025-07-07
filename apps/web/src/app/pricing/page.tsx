import { Metadata } from 'next'
import { PricingCards } from '../../components/pricing/pricing-cards'
import { PricingFAQ } from '../../components/pricing/pricing-faq'
import { GradientText } from '../../components/common/gradient-text'
import { motion } from 'framer-motion'

export const metadata: Metadata = {
  title: 'Pricing - Sports Event Tracker',
  description: 'Choose the perfect plan for tracking your favorite sports events. Free tier available!',
}

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent{' '}
          <GradientText gradient="primary">Pricing</GradientText>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free and upgrade as you grow. No hidden fees, cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <PricingCards />

      {/* FAQ Section */}
      <div className="mt-24">
        <PricingFAQ />
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center py-16 bg-muted/30 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">
          Ready to get started?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of sports fans who never miss their favorite events.
          Start your free trial today.
        </p>
      </div>
    </div>
  )
}