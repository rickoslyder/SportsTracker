import { Metadata } from 'next'
import { LegalHeader } from '../../../components/legal/legal-header'
import { PrivacyContent } from '../../../components/legal/privacy-content'
import { LegalNav } from '../../../components/legal/legal-nav'
import { LastUpdated } from '../../../components/legal/last-updated'

export const metadata: Metadata = {
  title: 'Privacy Policy - Sports Event Tracker',
  description: 'Learn how Sports Event Tracker collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <LegalHeader 
        title="Privacy Policy"
        description="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <aside className="lg:col-span-1">
          <LegalNav currentPage="privacy" />
        </aside>
        
        <main className="lg:col-span-3">
          <LastUpdated date="January 15, 2024" />
          <PrivacyContent />
        </main>
      </div>
    </div>
  )
}