import { Metadata } from 'next'
import { HelpHero } from '../../components/help/help-hero'
import { QuickLinks } from '../../components/help/quick-links'
import { HelpCategories } from '../../components/help/help-categories'
import { PopularArticles } from '../../components/help/popular-articles'
import { ContactSupport } from '../../components/help/contact-support'

export const metadata: Metadata = {
  title: 'Help Center - Sports Event Tracker',
  description: 'Get help with Sports Event Tracker. Find answers to common questions and contact our support team.',
}

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <HelpHero />
      <QuickLinks />
      <HelpCategories />
      <PopularArticles />
      <ContactSupport />
    </div>
  )
}