import { Metadata } from 'next'
import { LegalHeader } from '../../../components/legal/legal-header'
import { TermsContent } from '../../../components/legal/terms-content'
import { LegalNav } from '../../../components/legal/legal-nav'
import { LastUpdated } from '../../../components/legal/last-updated'

export const metadata: Metadata = {
  title: 'Terms of Service - Sports Event Tracker',
  description: 'Read our terms of service to understand your rights and responsibilities when using Sports Event Tracker.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <LegalHeader 
        title="Terms of Service"
        description="Please read these terms carefully before using Sports Event Tracker. By using our service, you agree to be bound by these terms."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <aside className="lg:col-span-1">
          <LegalNav currentPage="terms" />
        </aside>
        
        <main className="lg:col-span-3">
          <LastUpdated date="January 15, 2024" />
          <TermsContent />
        </main>
      </div>
    </div>
  )
}