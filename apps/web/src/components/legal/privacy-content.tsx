'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@sports-tracker/ui'
import { Info } from 'lucide-react'

export function PrivacyContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="prose prose-lg dark:prose-invert max-w-none"
    >
      <Card className="mb-8 border-primary/20">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Your Privacy Matters</p>
              <p className="text-sm text-muted-foreground">
                We are committed to protecting your privacy and being transparent about our data practices. 
                This policy applies to all Sports Event Tracker services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2>1. Information We Collect</h2>
      
      <h3>1.1 Information You Provide</h3>
      <ul>
        <li><strong>Account Information:</strong> Email address, username, and profile details when you create an account</li>
        <li><strong>Preferences:</strong> Your favorite sports, teams, and notification preferences</li>
        <li><strong>Payment Information:</strong> Billing details for premium subscriptions (processed securely by Stripe)</li>
        <li><strong>Communications:</strong> Messages you send to our support team</li>
      </ul>

      <h3>1.2 Information We Collect Automatically</h3>
      <ul>
        <li><strong>Usage Data:</strong> How you interact with our services, including pages visited and features used</li>
        <li><strong>Device Information:</strong> Device type, operating system, and browser information</li>
        <li><strong>Location Data:</strong> Your timezone for accurate event scheduling (with your permission)</li>
        <li><strong>Cookies:</strong> Small data files to remember your preferences and improve your experience</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and improve our sports event tracking services</li>
        <li>Send you reminders and notifications about events you've chosen to follow</li>
        <li>Personalize your experience based on your preferences</li>
        <li>Process payments and manage subscriptions</li>
        <li>Communicate with you about service updates and support</li>
        <li>Analyze usage patterns to improve our product</li>
        <li>Ensure the security and integrity of our services</li>
      </ul>

      <h2>3. Information Sharing</h2>
      <p>We do not sell your personal information. We share your information only in these circumstances:</p>
      <ul>
        <li><strong>Service Providers:</strong> With trusted partners who help us operate our services (e.g., email providers, payment processors)</li>
        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
        <li><strong>With Your Consent:</strong> When you explicitly agree to sharing</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your information, including:
      </p>
      <ul>
        <li>Encryption of data in transit and at rest</li>
        <li>Regular security audits and penetration testing</li>
        <li>Access controls and authentication requirements</li>
        <li>Employee training on data protection</li>
      </ul>

      <h2>5. Your Rights and Choices</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of your personal information</li>
        <li><strong>Correction:</strong> Update or correct your information</li>
        <li><strong>Deletion:</strong> Request deletion of your account and data</li>
        <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
        <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
        <li><strong>Cookie Preferences:</strong> Manage your cookie settings</li>
      </ul>

      <h2>6. Data Retention</h2>
      <p>
        We retain your information for as long as necessary to provide our services and comply with legal obligations. 
        When you delete your account, we remove your personal information within 30 days, except where retention 
        is required by law.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        Sports Event Tracker is not intended for children under 13. We do not knowingly collect personal 
        information from children. If you believe we have collected information from a child, please contact us.
      </p>

      <h2>8. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your own. We ensure 
        appropriate safeguards are in place to protect your information in accordance with this policy.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. We will notify you of significant changes via email 
        or through our services. Your continued use after changes indicates acceptance of the updated policy.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have questions about this privacy policy or our data practices, please contact us:
      </p>
      <ul>
        <li>Email: privacy@sportstracker.com</li>
        <li>Address: Sports Event Tracker, 123 Mission Street, San Francisco, CA 94105</li>
        <li>Data Protection Officer: dpo@sportstracker.com</li>
      </ul>

      <Card className="mt-8 bg-muted/50">
        <CardContent className="p-6">
          <p className="text-sm text-center text-muted-foreground">
            This privacy policy is effective as of January 15, 2024 and supersedes all previous versions.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}