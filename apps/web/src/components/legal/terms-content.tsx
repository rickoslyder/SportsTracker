'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@sports-tracker/ui'
import { AlertTriangle } from 'lucide-react'

export function TermsContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="prose prose-lg dark:prose-invert max-w-none"
    >
      <Card className="mb-8 border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Important Notice</p>
              <p className="text-sm text-muted-foreground">
                By using Sports Event Tracker, you agree to these terms. If you disagree with any part, 
                please discontinue use of our services immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Sports Event Tracker ("Service"), you agree to be bound by these Terms of Service 
        ("Terms"). These Terms constitute a legally binding agreement between you and Sports Event Tracker, Inc. 
        ("Company", "we", "us", or "our").
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Sports Event Tracker provides a platform for tracking sports events, setting reminders, and receiving 
        notifications about upcoming sporting events. The Service includes:
      </p>
      <ul>
        <li>Web, mobile, and desktop applications</li>
        <li>Event tracking and notification services</li>
        <li>Calendar integration features</li>
        <li>Premium subscription features</li>
        <li>API access (for eligible plans)</li>
      </ul>

      <h2>3. User Accounts</h2>
      
      <h3>3.1 Account Creation</h3>
      <p>
        To use certain features, you must create an account. You agree to:
      </p>
      <ul>
        <li>Provide accurate and complete information</li>
        <li>Maintain the security of your account credentials</li>
        <li>Promptly update any changes to your information</li>
        <li>Accept responsibility for all activities under your account</li>
      </ul>

      <h3>3.2 Account Termination</h3>
      <p>
        We reserve the right to suspend or terminate accounts that violate these Terms or engage in 
        fraudulent or illegal activities.
      </p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any illegal or unauthorized purpose</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Interfere with or disrupt the Service or servers</li>
        <li>Transmit viruses, malware, or harmful code</li>
        <li>Scrape or harvest data without permission</li>
        <li>Impersonate others or provide false information</li>
        <li>Use the Service to send spam or unsolicited messages</li>
        <li>Violate any applicable laws or regulations</li>
      </ul>

      <h2>5. Subscriptions and Payments</h2>
      
      <h3>5.1 Free and Premium Services</h3>
      <p>
        We offer both free and premium subscription tiers. Premium features require a paid subscription.
      </p>

      <h3>5.2 Billing</h3>
      <ul>
        <li>Subscriptions are billed in advance on a monthly or annual basis</li>
        <li>All fees are non-refundable except as required by law</li>
        <li>We reserve the right to change pricing with 30 days notice</li>
        <li>You are responsible for all applicable taxes</li>
      </ul>

      <h3>5.3 Cancellation</h3>
      <p>
        You may cancel your subscription at any time. Cancellation takes effect at the end of the current 
        billing period.
      </p>

      <h2>6. Intellectual Property</h2>
      
      <h3>6.1 Our Property</h3>
      <p>
        All content, features, and functionality of the Service are owned by Sports Event Tracker and 
        protected by intellectual property laws. You may not copy, modify, or distribute our content 
        without permission.
      </p>

      <h3>6.2 Your Content</h3>
      <p>
        You retain ownership of content you submit. By submitting content, you grant us a license to 
        use it in connection with providing the Service.
      </p>

      <h2>7. Privacy</h2>
      <p>
        Your use of the Service is subject to our Privacy Policy, which is incorporated into these Terms 
        by reference. Please review our Privacy Policy to understand our data practices.
      </p>

      <h2>8. Third-Party Services</h2>
      <p>
        The Service may contain links to or integrate with third-party services. We are not responsible 
        for the content or practices of third parties. Your use of third-party services is at your own risk.
      </p>

      <h2>9. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
        EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
      </p>
      <p>
        We do not guarantee:
      </p>
      <ul>
        <li>The accuracy or completeness of event information</li>
        <li>Uninterrupted or error-free service</li>
        <li>That defects will be corrected</li>
        <li>That the Service is free of viruses or harmful components</li>
      </ul>

      <h2>10. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, SPORTS EVENT TRACKER SHALL NOT BE LIABLE FOR ANY 
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, 
        DATA LOSS, OR BUSINESS INTERRUPTION.
      </p>
      <p>
        Our total liability shall not exceed the amount you paid us in the twelve months preceding 
        the claim.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Sports Event Tracker from any claims, damages, or 
        expenses arising from your use of the Service or violation of these Terms.
      </p>

      <h2>12. Changes to Terms</h2>
      <p>
        We may modify these Terms at any time. We will notify you of material changes via email or 
        through the Service. Continued use after changes constitutes acceptance.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of California, USA, without regard to conflict of law 
        principles. Any disputes shall be resolved in the courts of San Francisco County, California.
      </p>

      <h2>14. Dispute Resolution</h2>
      <p>
        Any disputes shall first be attempted to be resolved through good faith negotiations. If 
        unsuccessful, disputes shall be resolved through binding arbitration in accordance with the 
        American Arbitration Association rules.
      </p>

      <h2>15. General Provisions</h2>
      <ul>
        <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Sports Event Tracker</li>
        <li><strong>Severability:</strong> If any provision is found invalid, the remaining provisions continue in effect</li>
        <li><strong>Waiver:</strong> Our failure to enforce any right does not constitute a waiver</li>
        <li><strong>Assignment:</strong> You may not assign these Terms without our consent</li>
      </ul>

      <h2>16. Contact Information</h2>
      <p>
        For questions about these Terms, please contact us:
      </p>
      <ul>
        <li>Email: legal@sportstracker.com</li>
        <li>Address: Sports Event Tracker, Inc., 123 Mission Street, San Francisco, CA 94105</li>
        <li>Phone: 1-800-SPORTS-1</li>
      </ul>

      <Card className="mt-8 bg-muted/50">
        <CardContent className="p-6">
          <p className="text-sm text-center text-muted-foreground">
            These Terms of Service are effective as of January 15, 2024 and supersede all previous versions.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}