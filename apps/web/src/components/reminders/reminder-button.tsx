'use client'

import { useState } from 'react'
import { Bell, BellOff, Check, Loader2 } from 'lucide-react'
import { Button } from '@sports-tracker/ui'
import { cn } from '@sports-tracker/ui'
import { useReminders } from '../../hooks/use-reminders'
import { useUserConfig } from '../../hooks/use-user-config'
import { useUser } from '@clerk/nextjs'
import { useUserPreferences } from '../../stores/user-preferences'
import type { Database } from '@sports-tracker/types'

type Event = Database['public']['Tables']['events']['Row']

interface ReminderButtonProps {
  event: Event
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

export function ReminderButton({ event, size = 'sm', variant = 'outline', className }: ReminderButtonProps) {
  const { isSignedIn } = useUser()
  const { data: userConfig } = useUserConfig()
  const { preferences } = useUserPreferences()
  const { reminders, createReminder, deleteReminder, isCreating, isDeleting } = useReminders()
  const [showConfirm, setShowConfirm] = useState(false)

  // Check if reminder exists for this event
  const existingReminder = reminders.find(r => r.event_id === event.id)
  const isLoading = isCreating || isDeleting

  // Don't show for past events
  const eventDate = new Date(event.start_time)
  const isPastEvent = eventDate < new Date()
  if (isPastEvent) return null

  const handleClick = async () => {
    if (!isSignedIn) {
      // TODO: Show sign in modal or redirect
      window.location.href = '/sign-in'
      return
    }

    if (!userConfig) return

    if (existingReminder) {
      // Delete reminder
      if (!showConfirm) {
        setShowConfirm(true)
        setTimeout(() => setShowConfirm(false), 3000)
        return
      }
      deleteReminder(existingReminder.id)
      setShowConfirm(false)
    } else {
      // Create reminder with user defaults
      createReminder({
        eventId: event.id,
        userConfigId: userConfig.id,
        type: preferences.reminderDefaults.type,
        minutesBefore: preferences.reminderDefaults.minutesBefore,
      })
    }
  }

  const getButtonText = () => {
    if (!isSignedIn) return 'Sign in to set reminder'
    if (showConfirm) return 'Click again to remove'
    if (existingReminder) return 'Reminder set'
    return 'Set reminder'
  }

  const getIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />
    if (existingReminder && !showConfirm) return <Check className="h-4 w-4" />
    if (existingReminder && showConfirm) return <BellOff className="h-4 w-4" />
    return <Bell className="h-4 w-4" />
  }

  return (
    <Button
      size={size}
      variant={existingReminder && !showConfirm ? 'default' : variant}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'transition-all',
        showConfirm && 'ring-2 ring-destructive',
        className
      )}
    >
      {getIcon()}
      <span className="ml-2">{getButtonText()}</span>
    </Button>
  )
}