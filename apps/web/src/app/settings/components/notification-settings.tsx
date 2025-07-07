'use client'

import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sports-tracker/ui'
import { useUserPreferences } from '../../../stores/user-preferences'
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'

export function NotificationSettings() {
  const { preferences, setPreferences } = useUserPreferences()

  const reminderTypes = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'push', label: 'Push Notification', icon: Smartphone },
    { value: 'sms', label: 'SMS', icon: MessageSquare },
  ]

  const reminderTimes = [
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 1440, label: '1 day' },
  ]

  const handleReminderTypeChange = (type: string) => {
    setPreferences({
      reminderDefaults: {
        ...preferences.reminderDefaults,
        type: type as 'email' | 'push' | 'sms',
      },
    })
  }

  const handleReminderTimeChange = (value: string) => {
    setPreferences({
      reminderDefaults: {
        ...preferences.reminderDefaults,
        minutesBefore: parseInt(value),
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how and when you receive event reminders
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Default Reminder Type */}
        <div className="space-y-2">
          <Label htmlFor="reminder-type">Default Reminder Type</Label>
          <Select
            value={preferences.reminderDefaults.type}
            onValueChange={handleReminderTypeChange}
          >
            <SelectTrigger id="reminder-type">
              <SelectValue placeholder="Select reminder type" />
            </SelectTrigger>
            <SelectContent>
              {reminderTypes.map((type) => {
                const Icon = type.icon
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            How you'll receive notifications by default
          </p>
        </div>

        {/* Default Reminder Time */}
        <div className="space-y-2">
          <Label htmlFor="reminder-time">Default Reminder Time</Label>
          <Select
            value={preferences.reminderDefaults.minutesBefore.toString()}
            onValueChange={handleReminderTimeChange}
          >
            <SelectTrigger id="reminder-time">
              <SelectValue placeholder="Select reminder time" />
            </SelectTrigger>
            <SelectContent>
              {reminderTimes.map((time) => (
                <SelectItem key={time.value} value={time.value.toString()}>
                  {time.label} before event
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            When to send reminders before events start
          </p>
        </div>

        {/* Notification Preview */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Example Reminder</p>
          </div>
          <div className="pl-6 space-y-1">
            <p className="text-sm">
              You'll receive a {preferences.reminderDefaults.type} reminder{' '}
              {reminderTimes.find(t => t.value === preferences.reminderDefaults.minutesBefore)?.label}{' '}
              before each event starts.
            </p>
            <p className="text-xs text-muted-foreground">
              You can customize reminders for individual events
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}