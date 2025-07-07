import sgMail from '@sendgrid/mail'
import { logger } from '../utils/logger'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
  templateId?: string
  dynamicTemplateData?: Record<string, any>
}

export class EmailService {
  private from: string
  private enabled: boolean

  constructor() {
    this.from = process.env.SENDGRID_FROM_EMAIL || 'noreply@sportstracker.com'
    this.enabled = !!process.env.SENDGRID_API_KEY
  }

  async send(options: EmailOptions): Promise<boolean> {
    if (!this.enabled) {
      logger.warn('Email service is not enabled (missing SENDGRID_API_KEY)')
      return false
    }

    try {
      const msg: sgMail.MailDataRequired = {
        to: options.to,
        from: this.from,
        subject: options.subject,
      }

      if (options.templateId) {
        msg.templateId = options.templateId
        msg.dynamicTemplateData = options.dynamicTemplateData
      } else {
        msg.text = options.text || ''
        msg.html = options.html || options.text || ''
      }

      await sgMail.send(msg)
      logger.info(`Email sent successfully to ${options.to}`)
      return true
    } catch (error) {
      logger.error('Error sending email:', error)
      return false
    }
  }

  async sendEventReminder(email: string, eventName: string, eventTime: Date, eventLocation?: string): Promise<boolean> {
    const subject = `Reminder: ${eventName} is coming up!`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Event Reminder</h2>
        <p>Hi there!</p>
        <p>This is a reminder that <strong>${eventName}</strong> is coming up:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Event:</strong> ${eventName}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${eventTime.toLocaleString()}</p>
          ${eventLocation ? `<p style="margin: 5px 0;"><strong>Location:</strong> ${eventLocation}</p>` : ''}
        </div>
        <p>Don't miss it!</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          You're receiving this email because you set up a reminder for this event.
          <br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/notifications" style="color: #0066cc;">Manage your notification preferences</a>
        </p>
      </div>
    `

    return this.send({
      to: email,
      subject,
      html,
      text: `Reminder: ${eventName} is coming up at ${eventTime.toLocaleString()}${eventLocation ? ` at ${eventLocation}` : ''}`
    })
  }

  async sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
    const subject = 'Welcome to Sports Event Tracker!'
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Sports Event Tracker!</h1>
        <p>Hi${name ? ` ${name}` : ''},</p>
        <p>Thanks for signing up! We're excited to help you stay on top of all your favorite sports events.</p>
        <h3>Getting Started:</h3>
        <ul>
          <li>Browse upcoming events across different sports</li>
          <li>Set reminders so you never miss a match</li>
          <li>Customize your preferences in settings</li>
          <li>Enable no-spoiler mode to avoid results</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/events" 
             style="background-color: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Browse Events
          </a>
        </div>
        <p>If you have any questions, feel free to reach out!</p>
        <p>Best regards,<br>The Sports Event Tracker Team</p>
      </div>
    `

    return this.send({
      to: email,
      subject,
      html,
      text: `Welcome to Sports Event Tracker! Thanks for signing up. Browse events at ${process.env.NEXT_PUBLIC_APP_URL}/events`
    })
  }
}

export const emailService = new EmailService()