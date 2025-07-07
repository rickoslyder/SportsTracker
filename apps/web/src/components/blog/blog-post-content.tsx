'use client'

import { motion } from 'framer-motion'

export function BlogPostContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="prose prose-lg dark:prose-invert max-w-none mb-12"
    >
      <p className="lead text-xl text-muted-foreground">
        Formula 1 races happen all around the world, from Melbourne to Monaco, from Austin to Abu Dhabi. 
        With races taking place across multiple time zones, it's easy to miss the start of a session. 
        Here's our comprehensive guide to never missing another F1 moment.
      </p>

      <h2>Understanding F1 Session Times</h2>
      <p>
        A typical F1 race weekend consists of multiple sessions spread across three days:
      </p>
      <ul>
        <li><strong>Friday:</strong> Free Practice 1 & 2</li>
        <li><strong>Saturday:</strong> Free Practice 3 & Qualifying</li>
        <li><strong>Sunday:</strong> The Race</li>
      </ul>
      <p>
        Sprint weekends add an extra layer of complexity with modified schedules. Each session happens 
        at different times, and missing qualifying can be just as disappointing as missing the race itself.
      </p>

      <h2>The Time Zone Challenge</h2>
      <p>
        The 2024 F1 calendar spans 24 races across 21 countries and numerous time zones. For example:
      </p>
      <ul>
        <li>Australian GP: UTC+11 (early morning for European fans)</li>
        <li>Japanese GP: UTC+9 (early morning for American fans)</li>
        <li>Las Vegas GP: UTC-8 (late night for European fans)</li>
      </ul>

      <h2>Setting Up Perfect Reminders</h2>
      <p>
        Here's how to use Sports Event Tracker to never miss a session:
      </p>
      <ol>
        <li>
          <strong>Enable Smart Time Zones:</strong> Our app automatically converts all session times 
          to your local time zone, eliminating confusion.
        </li>
        <li>
          <strong>Set Multiple Reminders:</strong> We recommend setting reminders at:
          <ul>
            <li>24 hours before (to plan your day)</li>
            <li>2 hours before (final preparation)</li>
            <li>30 minutes before (get ready)</li>
          </ul>
        </li>
        <li>
          <strong>Use Session-Specific Alerts:</strong> Different reminders for practice, qualifying, 
          and race sessions ensure you catch what matters most to you.
        </li>
      </ol>

      <h2>Pro Tips for International Races</h2>
      <p>
        For races in significantly different time zones:
      </p>
      <ul>
        <li>Check if the race is worth staying up for or if you should watch a replay</li>
        <li>Enable our "No Spoiler Mode" if you plan to watch later</li>
        <li>Set a "Do Not Disturb" schedule to avoid result notifications</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        With proper planning and the right tools, you'll never miss another F1 session. Sports Event 
        Tracker makes it simple to follow the entire calendar, regardless of where in the world the 
        circus travels next.
      </p>
    </motion.div>
  )
}